const {
    Account,
    Address,
    AggregateTransaction,
    CosignatureTransaction,
    Deadline,
    Mosaic,
    NamespaceId,
    NetworkType,
    PlainMessage,
    PublicAccount,
    TransferTransaction,
    UInt64
} = require('nem2-sdk')


const alicePrivateKey = '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E',
    bobPublicKey = 'A07DF97F445AC0540A85D37153276542735D216DB25930FC8F608410859A6D81',
    bobPrivateKey = '7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4',
    charlieAddress = 'TD4ZKE-4P3HMB-M45K5O-3DMTIO-R4F5SZ-4CMFWG-PJZC';

const txAtoC = TransferTransaction.create(
    Deadline.create(),
    Address.createFromRawAddress(charlieAddress),
    [new Mosaic(new NamespaceId('nem.xem'), UInt64.fromUint(10000000))],
    PlainMessage.create('Welcome to NEM!'),
    NetworkType.TEST_NET
)
const txBtoA = TransferTransaction.create(
    Deadline.create(),
    Account.createFromPrivateKey(alicePrivateKey, NetworkType.TEST_NET).address,
    [new Mosaic(new NamespaceId('nem.xem'), UInt64.fromUint(10000000))],
    PlainMessage.create('Welcome to NEM!'),
    NetworkType.TEST_NET
)
const tx = AggregateTransaction.createComplete(
    Deadline.create(),
    [
        txAtoC.toAggregate(Account.createFromPrivateKey(alicePrivateKey, NetworkType.TEST_NET).publicAccount),
        txBtoA.toAggregate(PublicAccount.createFromPublicKey(bobPublicKey, NetworkType.TEST_NET))
    ],
    NetworkType.TEST_NET,
    [],
    UInt64.fromUint(50000)
)
const signedTx1 = Account.createFromPrivateKey(alicePrivateKey, NetworkType.TEST_NET).sign(
    tx,
    'CC42AAD7BD45E8C276741AB2524BC30F5529AF162AD12247EF9A98D6B54A385B'
)
const signedTx2 = Account.createFromPrivateKey(alicePrivateKey, NetworkType.TEST_NET).signTransactionWithCosignatories(
    tx,
    [Account.createFromPrivateKey(bobPrivateKey, NetworkType.TEST_NET)],
    'CC42AAD7BD45E8C276741AB2524BC30F5529AF162AD12247EF9A98D6B54A385B'
)
console.log(signedTx1)
console.log(signedTx2)

const aggregateFromPayload = AggregateTransaction.createFromPayload(signedTx1.payload)
console.log(aggregateFromPayload)

const cosigSigned = CosignatureTransaction
    .create(aggregateFromPayload)
    .signWith(Account.createFromPrivateKey(bobPrivateKey, NetworkType.TEST_NET))

const signedTx3 = Account
    .createFromPrivateKey(alicePrivateKey, NetworkType.TEST_NET)
    .signTransactionGivenSignatures(aggregateFromPayload, [cosigSigned], 'CC42AAD7BD45E8C276741AB2524BC30F5529AF162AD12247EF9A98D6B54A385B')
    


console.log(signedTx3)