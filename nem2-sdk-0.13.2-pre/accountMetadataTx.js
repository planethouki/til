const {
    Account,
    AccountMetadataTransaction,
    AggregateTransaction,
    Deadline,
    NetworkType,
    TransactionHttp,
    UInt64
 } = require('./144/dist/index')


 const recipient = Account.generateNewAccount(NetworkType.MIJIN_TEST)
 const sender = Account.createFromPrivateKey(
     '89A1F589EE18EF7E205FC40FC5BD54D3B50E0C248D9F088E280942587AABB08E',
     NetworkType.MIJIN_TEST
)

// const value = new Uint8Array(new Buffer('Hello World!'))
const value = new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,33])

const accountMetadataTransaction = AccountMetadataTransaction.create(
    Deadline.create(),
    sender.publicKey,
    UInt64.fromUint(3568),
    1,
    value,
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(0)
)

const aggregateTransaction = AggregateTransaction.createComplete(
    Deadline.create(),
    [
        accountMetadataTransaction.toAggregate(sender.publicAccount)
    ],
    NetworkType.MIJIN_TEST,
    [],
    UInt64.fromUint(24000)
)

const signedTransaction = sender.signTransactionWithCosignatories(
    aggregateTransaction,
    [],
    '43AE99FE757451CCF50E5CB372828254CD2CA2B91CBA61F11A2A1C031C09FE15'
)
// const signedTransaction = sender.sign(
//     accountMetadataTransaction,
//     '43AE99FE757451CCF50E5CB372828254CD2CA2B91CBA61F11A2A1C031C09FE15'
// )
console.log(signedTransaction.payload)
console.log(signedTransaction.hash)
// console.log(recipient.address.plain())
// console.log(recipient.privateKey)
// console.log(recipient.publicKey)
console.log(sender.privateKey)
console.log(sender.publicKey)

const t = new TransactionHttp('http://elephant2.48gh23s.xyz:3000')
t.announce(signedTransaction)