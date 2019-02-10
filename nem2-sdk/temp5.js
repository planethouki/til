const nem2lib = require("nem2-library");
const nem2Sdk = require("nem2-sdk");
const crypto = require("crypto");
const jssha3 = require('js-sha3');

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
    RegisterNamespaceTransaction = nem2Sdk.RegisterNamespaceTransaction,
    MosaicDefinitionTransaction = nem2Sdk.MosaicDefinitionTransaction,
    MosaicSupplyChangeTransaction = nem2Sdk.MosaicSupplyChangeTransaction,
    MosaicProperties = nem2Sdk.MosaicProperties,
    MosaicSupplyType = nem2Sdk.MosaicSupplyType;

const sha3_512 = jssha3.sha3_512;
const sha3_256 = jssha3.sha3_256;



const recipientAddress = 'SB2Y5ND4FDLBIO5KHXTKRWODDG2QHIN73DTYT2PC';
const deadline = Deadline.create(22);

const transferTransaction = TransferTransaction.create(
    deadline,
    Address.createFromRawAddress(recipientAddress),
    [new Mosaic(new MosaicId('nem:xem'), UInt64.fromUint(10000000)),],
    PlainMessage.create(''),
    NetworkType.MIJIN_TEST,
);

// transferTransaction.fee = UInt64.fromUint(10000000);

const privateKey = '72C95EBB2C20AAA47614BB12AFD7878015016AF27BD12CC5F50DF963583F8B5E';

const account = Account.createFromPrivateKey(privateKey,NetworkType.MIJIN_TEST);

const signedTransaction = account.sign(transferTransaction);

// const signData = signedTransaction.payload.substring((4+64+32)*2,(4+64+32+12)*2)
//     .concat('415628FD', '10000000',
//         signedTransaction.payload.substring((4+64+32+12+8)*2));
const signData = signedTransaction.payload.substring((4+64+32)*2,(4+64+32+12)*2)
    .concat('AAFC0B80', '11000000',
        signedTransaction.payload.substring((4+64+32+12+8)*2));
const keypair = nem2lib.KeyPair.createKeyPairFromPrivateKeyString(privateKey);
const signature = nem2lib.KeyPair.sign(keypair, signData);
const newPayload = signedTransaction.payload.substring(0,4*2)
    .concat(nem2lib.convert.uint8ToHex(signature),
        signedTransaction.payload.substring((4+64)*2,(4+64+32)*2),
        signData);



const payload = newPayload.substring(4*2,(4+32)*2)
    .concat(newPayload.substring((4+64)*2));
// const payload = signedTransaction.payload.substring(4*2,(4+32)*2)
//     .concat(signedTransaction.payload.substring((4+64)*2));
const hasher = sha3_256.create();
const hash = hasher.update(Buffer.from(payload, 'hex')).hex().toUpperCase();


// const transactionHttp = new TransactionHttp('http://localhost:3000');
// transactionHttp.announce(signedTransaction).subscribe(x => console.log(x),
//     err => console.error(err));

// console.log('HASH:    ' + signedTransaction.hash);
// console.log('SIGNER:  ' + signedTransaction.signer);
// console.log('payload: ' + signedTransaction.payload);
// console.log('deadline:' + signedTransaction.payload.substring(112*2, (112+8)*2));
// console.log('deadline:' + deadline.value);
// console.log('now:     ' + new Date().toLocaleString());
console.log(newPayload);
console.log(hash);

//curl -X PUT -H 'Content-Type:application/json' -d '{"payload": ""}' http://localhost:3000/transaction
