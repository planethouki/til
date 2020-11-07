const { 
    Account,
    Deadline,
    Mosaic,
    MosaicId,
    NetworkType,
    PlainMessage,
    RepositoryFactoryHttp,
    TransferTransaction,
    UInt64
} = require('symbol-sdk');

const privateKey = "1498b5467a63dffa2dc9d9e069caf075d16fc33fdd4c3b01bfadae6433767d93";
const publicKey = "b7a3c12dc0c8c748ab07525b701122b88bd78f600c76342d27f25e5f92444cde";

const hoge = Account.createFromPrivateKey(privateKey, NetworkType.TEST_NET);
console.log(hoge.publicKey);