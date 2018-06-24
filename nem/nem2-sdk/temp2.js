const nem2Sdk = require("nem2-sdk");

const Address = nem2Sdk.Address,
    Deadline = nem2Sdk.Deadline,
    Account = nem2Sdk.Account,
    UInt64 = nem2Sdk.UInt64,
    NetworkType = nem2Sdk.NetworkType,
    PlainMessage = nem2Sdk.PlainMessage,
    TransferTransaction = nem2Sdk.TransferTransaction,
    TransactionHttp = nem2Sdk.TransactionHttp,
    XEM = nem2Sdk.XEM;

const recipientAddress = 'SALVQVE24TNQP6FVOR5RLSGNVXQNMM4LGSUPIFTH';

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    Address.createFromRawAddress(recipientAddress),
    [XEM.createRelative(10)],
    PlainMessage.create('Welcome To NEM'),
    NetworkType.MIJIN_TEST,
);

const privateKey = '2744A8A334933A9CBEF0F73FA4D2C7DC32CE2547422DFEC69B972AA14DC57093';

const account = Account.createFromPrivateKey(privateKey,NetworkType.MIJIN_TEST);

const signedTransaction = account.sign(transferTransaction);

// const transactionHttp = new TransactionHttp('http://localhost:9000');

// transactionHttp.announceSync(signedTransaction).subscribe(x => console.log(x),
//     err => console.error(err));

console.log('HASH:    ' + signedTransaction.hash);
console.log('SIGNER:  ' + signedTransaction.signer);
console.log('payload: ' + signedTransaction.payload);