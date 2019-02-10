const nem2Sdk = require("nem2-sdk");
const nem2lib = require("nem2-library");
const crypto = require("crypto");
const jssha3 = require('js-sha3');
const rx = require('rxjs');
const op = require('rxjs/operators');
const request = require('request');

const Address = nem2Sdk.Address,
    Deadline = nem2Sdk.Deadline,
    Account = nem2Sdk.Account,
    UInt64 = nem2Sdk.UInt64,
    NetworkType = nem2Sdk.NetworkType,
    PlainMessage = nem2Sdk.PlainMessage,
    TransferTransaction = nem2Sdk.TransferTransaction,
    Mosaic = nem2Sdk.Mosaic,
    MosaicId = nem2Sdk.MosaicId,
    TransactionHttp = nem2Sdk.TransactionHttp,
    AccountHttp = nem2Sdk.AccountHttp,
    MosaicHttp = nem2Sdk.MosaicHttp,
    NamespaceHttp = nem2Sdk.NamespaceHttp,
    MosaicService = nem2Sdk.MosaicService,
    XEM = nem2Sdk.XEM,
    AggregateTransaction = nem2Sdk.AggregateTransaction,
    PublicAccount = nem2Sdk.PublicAccount,
    LockFundsTransaction = nem2Sdk.LockFundsTransaction,
    Listener = nem2Sdk.Listener,
    CosignatureTransaction = nem2Sdk.CosignatureTransaction,
    SecretLockTransaction = nem2Sdk.SecretLockTransaction,
    SecretProofTransaction = nem2Sdk.SecretProofTransaction,
    HashType = nem2Sdk.HashType,
    ModifyMultisigAccountTransaction = nem2Sdk.ModifyMultisigAccountTransaction,
    MultisigCosignatoryModificationType = nem2Sdk.MultisigCosignatoryModificationType,
    MultisigCosignatoryModification = nem2Sdk.MultisigCosignatoryModification,
    TransactionType = nem2Sdk.TransactionType;

const sha3_512 = jssha3.sha3_512;
const sha3_256 = jssha3.sha3_256;

/*
Ticket:
  private: 084513BEA4F01EECC15AEC65122BB4D3E70CA3670EC776C593BE949DFF712B21
  public: CC9E167E28CA4227F5C461BF40AEC60EFB98E200C998F86BEBCD68D4FC66D993
  address: SAJC2DOC76EATVJF65KE6U2TVGIN3FNQZRJOEWNZ
Alice:
  private: FC4A39AE6E17DAE2F72440DB93BF76C3C6C1684735FD8501BD87BCDCAD1E6D8C
  public: A86F31C436489485C6CE91DECAAF7546BC289093BBB23EE5DD975462B072D134
  address: SAGR32KYXS2Y65J3XTI53VI4F4EURKFQNPKX56XT
*/


const alicePrivateKey = 'FC4A39AE6E17DAE2F72440DB93BF76C3C6C1684735FD8501BD87BCDCAD1E6D8C';
const aliceAccount = Account.createFromPrivateKey(alicePrivateKey, NetworkType.MIJIN_TEST);

const ticketDistributorPublicKey = 'CC9E167E28CA4227F5C461BF40AEC60EFB98E200C998F86BEBCD68D4FC66D993';
const ticketDistributorPublicAccount = PublicAccount.createFromPublicKey( ticketDistributorPublicKey, NetworkType.MIJIN_TEST);

const ticketDistributorPrivateKey = '084513BEA4F01EECC15AEC65122BB4D3E70CA3670EC776C593BE949DFF712B21';
const ticketDistributorAccount = Account.createFromPrivateKey(ticketDistributorPrivateKey, NetworkType.MIJIN_TEST);



const random = crypto.randomBytes(10);
const hash = sha3_512.create();
const secret = hash.update(random).hex().toUpperCase();
const proof = random.toString('hex');

// console.debug('x    (proof)     : ' + proof);
// console.debug('H(x) (secret)    : ' + secret);

const aliceToTicketDistributorTx = TransferTransaction.create(
    Deadline.create(),
    ticketDistributorPublicAccount.address,
    [new Mosaic( new MosaicId('nem:xem'), UInt64.fromUint(1000000))],
    PlainMessage.create('send 1 nem:xem to distributor'),
    NetworkType.MIJIN_TEST,
);
const signedAliceTx = aliceAccount.sign(aliceToTicketDistributorTx);

const ticketDistributorToAliceTx = SecretLockTransaction.create(
    Deadline.create(),
    new Mosaic( new MosaicId('nem:xem'), UInt64.fromUint(1000000)),
    UInt64.fromUint(96*60),
    HashType.SHA3_512,
    secret,
    aliceAccount.address,
    NetworkType.MIJIN_TEST,
);
const signedSecretLockTx = ticketDistributorAccount.sign(ticketDistributorToAliceTx);

const ticketDistributorSecretProofTx = SecretProofTransaction.create(
    Deadline.create(),
    HashType.SHA3_512,
    secret,
    proof,
    NetworkType.MIJIN_TEST,
);
const signedSecretProofTx = ticketDistributorAccount.sign(ticketDistributorSecretProofTx);


const lockTargetTx = signedAliceTx;


const refTx = SecretLockTransaction.create(
    Deadline.create(),
    XEM.createRelative(10),
    UInt64.fromUint(60),
    HashType.SHA3_512,
    secret,
    ticketDistributorPublicAccount.address,
    NetworkType.MIJIN_TEST
);
const signedRefTx = aliceAccount.sign(refTx);
const hashLockTxPayload = 
    "B0000000" +
    signedRefTx.payload.substr((4*2),(64+32+2)*2) +      // sign + pubkey + version
    "4C41" +
    signedRefTx.payload.substr(((4+64+32+2+2)*2),(40)*2) +
    lockTargetTx.hash;
const hashLockTxPayloadSigningBytes = hashLockTxPayload.substr(100*2);
const keypair = nem2lib.KeyPair.createKeyPairFromPrivateKeyString(alicePrivateKey);
const signatureByte = nem2lib.KeyPair.sign(keypair, hashLockTxPayloadSigningBytes);
const signature = nem2lib.convert.uint8ToHex(signatureByte);
const signedHashLockTxPayload =
    hashLockTxPayload.substr(0,4*2) +
    signature +
    hashLockTxPayload.substr((4+64)*2);
const hashInputPayload = 
    signedHashLockTxPayload.substr(4*2,32*2) +
    signedHashLockTxPayload.substr((4+64)*2,32*2) +
    signedHashLockTxPayload.substr((4+64+32)*2);
const signedHashLockTxHash = sha3_256.create().update(Buffer.from(hashInputPayload, 'hex')).hex().toUpperCase();



console.log(`signedHashLockTxHash: ${signedHashLockTxHash}`);
console.log('target.hash  : ' + lockTargetTx.hash);


// const url = "http://catapult-test.44uk.net:3000";       //http://test-nem2-faucet.44uk.net/
const url = "http://catapult48gh23s.xyz:3000"        //https://faucet48gh23s.azurewebsites.net/
// const url = 'http://localhost:3000'

const transactionHttp = new TransactionHttp(url);
const accountHttp = new AccountHttp(url);
const listener = new Listener(url);


listener.open().then(() => {

    
    request.put({
        url: `${url}/transaction`,
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({"payload": signedHashLockTxPayload})
    }, (error, response, body) => {
        if(error) console.error(error);
        console.log(response.body);
    });

    listener.confirmed(aliceAccount.address)
    .pipe(
        op.filter((transaction) => transaction.transactionInfo !== undefined
            && transaction.transactionInfo.hash === signedHashLockTxHash),
        op.mergeMap(ignored => transactionHttp.announce(lockTargetTx)),
    )
    .subscribe(
        announced => {
            console.log("announced transaction that hash is in lockfuncs");
            console.log(announced);
        },
        err => console.error(err)
    );


    listener.confirmed(aliceAccount.address)
    .pipe(
        op.filter((transaction) => {
            // console.log(transaction.transactionInfo !== undefined ? transaction.transactionInfo.hash : "")
            return transaction.transactionInfo !== undefined 
                && transaction.transactionInfo.hash === lockTargetTx.hash
        }),
    )
    .subscribe(
        x => {
            console.log("confirmed lockTargetTx");
            console.log(x.transactionInfo.hash);
            listener.close();
        },
        err => console.error(err)
    );

})
