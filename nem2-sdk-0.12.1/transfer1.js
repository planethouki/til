const {
    Account,
    Address,
    Deadline,
    NetworkCurrencyMosaic,
    NetworkType,    
    PlainMessage,
    TransactionHttp,
    TransferTransaction,
    UInt64
} = require("nem2-sdk");

const recipientAddress = 'SB2Y5ND4FDLBIO5KHXTKRWODDG2QHIN73DTYT2PC';
const generationHash = 'AC8EE4E2D1FEA3C84D5E8DC8D032B16FC86EB89B494B1D4A0A5E7CD66BC4AC30';
const privateKey = '7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4';

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    Address.createFromRawAddress(recipientAddress),
    [NetworkCurrencyMosaic.createRelative(0)],
    PlainMessage.create(''),
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(0)
);

const account = Account.createFromPrivateKey(privateKey,NetworkType.MIJIN_TEST);
const signedTransaction = account.sign(transferTransaction, generationHash);

// const transactionHttp = new TransactionHttp('http://13.114.200.132:3000');
// transactionHttp.announce(signedTransaction).subscribe(
//     x => console.log(x),
//     err => console.error(err)
// );

console.log('HASH:    ' + signedTransaction.hash);
console.log('SIGNER:  ' + signedTransaction.signer);
console.log('PAYLOAD: ' + signedTransaction.payload);