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




const recipientAddress = 'SB2Y5ND4FDLBIO5KHXTKRWODDG2QHIN73DTYT2PC';

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    Address.createFromRawAddress(recipientAddress),
    [new Mosaic(new MosaicId('nem:xem'), UInt64.fromUint(1000000))],
    PlainMessage.create('0000111122223333'),
    NetworkType.MIJIN_TEST,
);

const privateKey = 'C3EB947179B4D3295F30ADC21A4E121B9431D485C1058BE4295C30A4A5127E9C';

const account = Account.createFromPrivateKey(privateKey,NetworkType.MIJIN_TEST);

const signedTransaction = account.sign(transferTransaction);

const transactionHttp = new TransactionHttp('http://localhost:9000');
transactionHttp.announceSync(signedTransaction).subscribe(
    x => console.log(x),
    err => console.error(err)
);

console.log('HASH:    ' + signedTransaction.hash);
console.log('SIGNER:  ' + signedTransaction.signer);
console.log('payload: ' + signedTransaction.payload);