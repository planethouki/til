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
    TransactionHttp = nem2Sdk.TransactionHttp;


const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    Address.createFromRawAddress('SB2Y5N-D4FDLB-IO5KHX-TKRWOD-DG2QHI-N73DTY-T2PC'),
    [new Mosaic(new MosaicId('nem:xem'), UInt64.fromUint(10))],
    PlainMessage.create('my first transfer transaction!'),
    NetworkType.MIJIN_TEST
);

//const privateKey = process.env.PRIVATE_KEY;
const privateKey = '7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4';

const account = Account.createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST);

const signedTransaction = account.sign(transferTransaction);

console.log('HASH:   ' + signedTransaction.hash)
console.log('SIGNER: ' + signedTransaction.signer)

const transactionHttp = new TransactionHttp('http://192.168.11.77:3000');

transactionHttp.announce(signedTransaction).subscribe(
    x => console.log(x),
    err => console.log(err)
);