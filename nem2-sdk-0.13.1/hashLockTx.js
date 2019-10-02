const {
    Account,
    Deadline,
    HashLockTransaction,
    NetworkType,
    Mosaic,
    MosaicId,
    TransactionType,
    UInt64
 } = require('nem2-sdk')

 const recipient = Account.generateNewAccount(NetworkType.MIJIN_TEST)
 const sender = Account.generateNewAccount(NetworkType.MIJIN_TEST)

const hashLockTransaction = HashLockTransaction.create(
    Deadline.create(),
    new Mosaic(new MosaicId('77A1969932D987D7'), UInt64.fromUint(10000000)),
    UInt64.fromUint(480),
    {
        type: TransactionType.AGGREGATE_BONDED,
        hash: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    },
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(20000)
)

const signedTransaction = sender.sign(hashLockTransaction, '')
console.log(signedTransaction.payload)
console.log(recipient.address.plain())
console.log(sender.privateKey)
console.log(sender.publicKey)


// B0000000BC979BF1D6E2A8DDAE23CF9D32C1AF30951F8C255975A0D52887C7CA27224FC4C8C5CEB7323CCF871975A95E340F91D6A4C8773F5A9220117FFF6DA1E3F779071B980EAFDD0B0A920CCCFD8285E0C890F2C5974A41F60D19CB634173208B907701904841204E00000000000064F129B018000000D787D9329996A1778096980000000000E001000000000000AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
// SD7VXPZMYTJO2JZUEBWJ6QDSSKWYIGXLHD2LCUOU
// 81D21BA22CBF24BD7E1ECAC84FB34B17313ABECFEEB7FC8CCAA52EDE35286F3C
// 1B980EAFDD0B0A920CCCFD8285E0C890F2C5974A41F60D19CB634173208B9077