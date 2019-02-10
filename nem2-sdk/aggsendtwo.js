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
    AggregateTransaction = nem2Sdk.AggregateTransaction;



// Replace with private key
const danPrivateKey = '7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4';

// Replace with addresses
const aliceAddress = 'SB2Y5N-D4FDLB-IO5KHX-TKRWOD-DG2QHI-N73DTY-T2PC';
const bobAddress =  'SBKUNR-OFEK7Z-L3EO7B-PW67FC-KGJWSY-PYYYMT-6VRN';

const account = Account.createFromPrivateKey(danPrivateKey, NetworkType.MIJIN_TEST);

const brotherAccount = Address.createFromRawAddress(aliceAddress);
const sisterAccount = Address.createFromRawAddress(bobAddress);

const amount = XEM.createRelative(10); // 10 xem represent 10 000 000 micro xem

const brotherTransferTransaction = TransferTransaction.create(Deadline.create(), brotherAccount, [amount], PlainMessage.create('payout'), NetworkType.MIJIN_TEST);
const sisterTransferTransaction = TransferTransaction.create(Deadline.create(), sisterAccount, [amount], PlainMessage.create('payout'), NetworkType.MIJIN_TEST);

const aggregateTransaction = AggregateTransaction.createComplete(
    Deadline.create(),
    [
        brotherTransferTransaction.toAggregate(account.publicAccount),
        sisterTransferTransaction.toAggregate(account.publicAccount)],
    NetworkType.MIJIN_TEST,
    []
);

const transactionHttp = new TransactionHttp('http://localhost:3000');

const signedTransaction = account.sign(aggregateTransaction);

transactionHttp.announce(signedTransaction).subscribe(x => console.log(x),
        err => console.error(err));


console.log('HASH:   ' + signedTransaction.hash);
console.log('SIGNER: ' + signedTransaction.signer);