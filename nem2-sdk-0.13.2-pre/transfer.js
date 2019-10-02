const {
    Account,
    Deadline,
    NetworkType,
    PlainMessage,
    Mosaic,
    MosaicId,
    TransactionHttp,
    TransferTransaction,
    UInt64
} = require('./144/dist/index')

const recipient = Account.generateNewAccount(NetworkType.MIJIN_TEST)
const sender = Account.createFromPrivateKey(
    'C09F293A55200EA318B48A308C4B8E987AF859F3AE781031C2DCD039E7C52D9D',
    NetworkType.MIJIN_TEST
)

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    recipient.address,
    [new Mosaic(new MosaicId('35DA50B9E4FD465F'), UInt64.fromUint(0))],
    new PlainMessage(''),
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(20000)
)

const signedTransaction = sender.sign(
    transferTransaction,
    '9EEF12F332F72C9E5416AEA45535C7DE74EACD66B90B6269830D229570F501AC'
);

const transactionHttp = new TransactionHttp('http://elephant3.48gh23s.xyz:3000');
transactionHttp.announce(signedTransaction);