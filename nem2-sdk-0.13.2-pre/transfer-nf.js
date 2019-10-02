const {
    Account,
    Address,
    Deadline,
    NetworkType,
    PlainMessage,
    Mosaic,
    MosaicId,
    TransactionHttp,
    TransferTransaction,
    UInt64
} = require('./144/dist/index')

// const recipient = Account.generateNewAccount(NetworkType.MIJIN_TEST).address
const recipient = Address.createFromRawAddress('SCA7ZS-2B7DEE-BGU3TH-SILYHC-RUR32Y-YE55ZB-LYA2');
const sender = Account.createFromPrivateKey(
    '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E',
    NetworkType.MIJIN_TEST
)

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    recipient,
    [new Mosaic(new MosaicId('77A1969932D987D7'), UInt64.fromUint(0))],
    new PlainMessage(''),
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(20000)
)

const signedTransaction = sender.sign(
    transferTransaction,
    '9F1979BEBA29C47E59B40393ABB516801A353CFC0C18BC241FEDE41939C907E7'
);
console.log(signedTransaction.hash);

const transactionHttp = new TransactionHttp('http://13.114.200.132:3000');
// const transactionHttp = new TransactionHttp('http://52.194.207.217:3000');
transactionHttp.announce(signedTransaction).toPromise().then((result) => {
    console.log(result);
}).catch((error) => {
    console.error(error);
});