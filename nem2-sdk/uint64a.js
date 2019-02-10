

const nem2Sdk = require("nem2-sdk");

const BigInt = require("BigInt");

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

const number = BigInt.str2bigInt("2729735958921713743", 10);

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    Address.createFromRawAddress(recipientAddress),
    [new Mosaic(new MosaicId('nem:xem'), UInt64.fromUint(number))],  // 0x25E1F8645223984F 
    PlainMessage.create(''),
    NetworkType.MIJIN_TEST,
);

transferTransaction.fee = UInt64.fromUint(10000000);

const privateKey = '7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4';

const account = Account.createFromPrivateKey(privateKey,NetworkType.MIJIN_TEST);

const signedTransaction = account.sign(transferTransaction);

const transactionHttp = new TransactionHttp('http://192.168.11.77:3000');

transactionHttp.announce(signedTransaction).subscribe(x => console.log(x),
    err => console.error(err));

console.log('HASH:    ' + signedTransaction.hash);
console.log('SIGNER:  ' + signedTransaction.signer);
console.log('payload: ' + signedTransaction.payload);