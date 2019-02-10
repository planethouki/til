const nem2Sdk = require("nem2-sdk");

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
    XEM = nem2Sdk.XEM,
    AggregateTransaction = nem2Sdk.AggregateTransaction,
    PublicAccount = nem2Sdk.PublicAccount,
    LockFundsTransaction = nem2Sdk.LockFundsTransaction,
    Listener = nem2Sdk.Listener,
    CosignatureTransaction = nem2Sdk.CosignatureTransaction,
    AccountHttp = nem2Sdk.AccountHttp;




const recipientAddress = 'NDNOJ5TOUV5DYYJJKFD4WJ7KMVMX6I5ZTIKF3KX5';

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    Address.createFromRawAddress(recipientAddress),
    [XEM.createRelative(10)],
    PlainMessage.create('Welcome To NEM'),
    NetworkType.MAIN_NET,
);

transferTransaction.fee = UInt64.fromUint(10000000);

const privateKey = 'FDDA17AA6D5AD79A6DA7E46DBBA5A17890B0D221B352997A568A2F6FABA27746';

const account = Account.createFromPrivateKey(privateKey,NetworkType.MAIN_NET);

const signedTransaction = account.sign(transferTransaction);

const transactionHttp = new TransactionHttp('http://192.168.33.10:3000');

transactionHttp.announce(signedTransaction).subscribe(x => console.log(x),
    err => console.error(err));

console.log('HASH:    ' + signedTransaction.hash);
console.log('SIGNER:  ' + signedTransaction.signer);
console.log('payload: ' + signedTransaction.payload);