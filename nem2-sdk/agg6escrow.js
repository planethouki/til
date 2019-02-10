const nem2Sdk = require("nem2-sdk");
const crypto = require("crypto")
const jssha3 = require('js-sha3')
const sha3_512 = jssha3.sha3_512
const rx = require('rxjs')
const op = require('rxjs/operators')

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

console.debug('x    (proof)     : ' + proof);
console.debug('H(x) (secret)    : ' + secret);

const aliceToTicketDistributorTx = TransferTransaction.create(
    Deadline.create(),
    ticketDistributorPublicAccount.address,
    [new Mosaic( new MosaicId('nem:xem'), UInt64.fromUint(1000000))],
    PlainMessage.create('send 1 nem:xem to distributor'),
    NetworkType.MIJIN_TEST,
);

const ticketDistributorToAliceTx = SecretLockTransaction.create(
    Deadline.create(),
    new Mosaic( new MosaicId('nem:xem'), UInt64.fromUint(1000000)),
    UInt64.fromUint(96*60),
    HashType.SHA3_512,
    secret,
    aliceAccount.address,
    NetworkType.MIJIN_TEST,
)

const ticketDistributorSecretProofTx = SecretProofTransaction.create(
    Deadline.create(),
    HashType.SHA3_512,
    secret,
    proof,
    NetworkType.MIJIN_TEST,
);
const signedSecretProofTx = ticketDistributorAccount.sign(ticketDistributorSecretProofTx)

const aggregateTransaction = AggregateTransaction.createBonded(Deadline.create(),
    [
        aliceToTicketDistributorTx.toAggregate(aliceAccount.publicAccount),
        ticketDistributorToAliceTx.toAggregate(ticketDistributorPublicAccount),
    ],
    NetworkType.MIJIN_TEST);
const signedAggregateTransaction = aliceAccount.sign(aggregateTransaction);

const lockFundsTransaction = LockFundsTransaction.create(
    Deadline.create(),
    new Mosaic( new MosaicId('nem:xem'), UInt64.fromUint(10000000)),
    UInt64.fromUint(480),
    signedAggregateTransaction,
    NetworkType.MIJIN_TEST);
const lockFundsTransactionSigned = aliceAccount.sign(lockFundsTransaction);


console.log('lockFundsTransactionSigned.hash  : ' + lockFundsTransactionSigned.hash);
console.log('lockFundsTransactionSigned.signer: ' + lockFundsTransactionSigned.signer);
console.log('aggregateTransactionSigned.hash  : ' + signedAggregateTransaction.hash);
console.log('aggregateTransactionSigned.signer: ' + signedAggregateTransaction.signer);
console.log('secretProofTransactionSigned.hash  : ' + signedSecretProofTx.hash);
console.log('secretProofTransactionSigned.signer: ' + signedSecretProofTx.signer);


// const url = "http://catapult-test.44uk.net:3000";       //http://test-nem2-faucet.44uk.net/
const url = "http://catapult48gh23s.xyz:3000"        //https://faucet48gh23s.azurewebsites.net/
// const url = 'http://localhost:3000'

const transactionHttp = new TransactionHttp(url);
const accountHttp = new AccountHttp(url);
const listener = new Listener(url);

const cosignAggregateBondedTransaction = (transaction, account)  => {
    const cosignatureTransaction = CosignatureTransaction.create(transaction);
    return account.signCosignatureTransaction(cosignatureTransaction);
};

listener.open().then(() => {

    transactionHttp.announce(lockFundsTransactionSigned).subscribe(
        x => {
            console.log("announced lock funds transaction signed by alice")
            console.log(x)
        },
        err => console.error(err)
    );

    listener.confirmed(aliceAccount.address)
    .pipe(
        op.filter((transaction) => transaction.transactionInfo !== undefined
            && transaction.transactionInfo.hash === lockFundsTransactionSigned.hash),
        op.mergeMap(ignored => transactionHttp.announceAggregateBonded(signedAggregateTransaction)),
    )
    .subscribe(
        announcedAggregateBonded => {
            console.log("announced aggregate bonded transaction signed by alice")
            console.log(announcedAggregateBonded)
        },
        err => console.error(err)
    );

    listener
    .aggregateBondedAdded(ticketDistributorPublicAccount.address)
    .pipe(
        op.filter((transaction) => transaction.transactionInfo !== undefined
            && transaction.transactionInfo.hash === signedAggregateTransaction.hash),
        op.map(transaction => {
            // console.debug(`hash: ${transaction.transactionInfo.hash}`)
            const cosignatureTransaction = CosignatureTransaction.create(transaction);
            return ticketDistributorAccount.signCosignatureTransaction(cosignatureTransaction);
        }),
        op.mergeMap(cosignatureSignedTransaction  => {
            // console.debug(`parent hash: ${cosignatureSignedTransaction.parentHash}`)
            // console.debug(`signer: ${cosignatureSignedTransaction.signer}`)
            return transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction)
        }),
    )
    .subscribe(
        x => {
            console.log("announced cosignature transaction signed by ticket distributor")
            console.log(x)
        },
        err => console.error(err)
    );

    listener.confirmed(ticketDistributorPublicAccount.address)
    .pipe(
        op.filter((transaction) => {
            // console.log(transaction.transactionInfo !== undefined ? transaction.transactionInfo.hash : "")
            return transaction.transactionInfo !== undefined 
                && transaction.transactionInfo.hash === signedAggregateTransaction.hash
        }),
        op.mergeMap(ignored => {
            // console.log(ignored)
            return transactionHttp.announce(signedSecretProofTx)
        }),
    )
    .subscribe(
        x => {
            console.log("announced secret proof transaction signed by ticket distributor")
            console.log(x)
        },
        err => console.error(err)
    );

})
