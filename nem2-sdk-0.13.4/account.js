const {
    Account,
    Deadline,
    NetworkType,
    PlainMessage,
    Mosaic,
    MosaicId,
    NamespaceId,
    TransactionHttp,
    TransferTransaction,
    UInt64
} = require('nem2-sdk')


const recipient = Account.generateNewAccount(NetworkType.TEST_NET)
const sender = Account.createFromPrivateKey(
    '3980CC5C2C3D010B5C9D0E7DE0642D161E5A7D8319CA44EB333A2C5DDAFEC37A',
    NetworkType.TEST_NET
)

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    recipient.address,
    [new Mosaic(new NamespaceId('cat.currency'), UInt64.fromUint(100))],
    new PlainMessage(''),
    NetworkType.TEST_NET,
    UInt64.fromUint(100000)
)

const signedTransaction = sender.sign(
    transferTransaction,
    'A8204C0DA4535DE01B3B51CF54D9D20D663059790C4422A83B7A079C596FE01F'
);


console.log(signedTransaction.hash);
console.log(sender.publicKey)