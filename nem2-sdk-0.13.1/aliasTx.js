const {
    Account,
    AliasTransaction,
    AliasActionType,
    Deadline,
    NetworkType,
    MosaicNonce,
    MosaicId,
    NamespaceId,
    UInt64
 } = require('nem2-sdk')

 const sender = Account.generateNewAccount(NetworkType.MIJIN_TEST)
 const nonce = MosaicNonce.createRandom()

const aliasTransaction1 = AliasTransaction.createForMosaic(
    Deadline.create(),
    AliasActionType.Link,
    new NamespaceId('foo'),
    MosaicId.createFromNonce(nonce, sender.publicAccount),
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(20000)
)

const signedTransaction1 = sender.sign(aliasTransaction1, '')
console.log(signedTransaction1.payload)
console.log(sender.privateKey)
console.log(sender.publicKey)

// 8900000000A0EBC3C803584273FF70E59C8BFA93DB58A2709A27A9619E491D9E0987B892C8592D986F4F7FE4EA440DBF2E0C426EB87FA7206FC21262A485B959D385430983CFC0021AA39F308AA05E0535F6C3643DB944AB103C72AD5B118510D0B489C001904E43204E0000000000003DE624B1180000000054C07E58ACD1A98227F2DC9B0A0BC86A
// 5C459F834DFB70A22C5C16201C9463FC980A488730EB59B47B2EA4A8A8C71D24
// 83CFC0021AA39F308AA05E0535F6C3643DB944AB103C72AD5B118510D0B489C0


const aliasTransaction2 = AliasTransaction.createForAddress(
    Deadline.create(),
    AliasActionType.Link,
    new NamespaceId('foo'),
    Account.generateNewAccount(NetworkType.MIJIN_TEST).address,
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(20000)
)

const signedTransaction2 = sender.sign(aliasTransaction2, '')
console.log(signedTransaction2.payload)

// 9A0000004FD7588C3E6FE7485CADAFA2B4342F3851C82739687B6E32479A838F58758ACFEF432172E65188CA725C8CFBB7E5867045190FC0FDBAAF3637290810A3A64E0E83CFC0021AA39F308AA05E0535F6C3643DB944AB103C72AD5B118510D0B489C001904E42204E00000000000051E624B1180000000054C07E58ACD1A98290842FCE3F3C911AF9BEE3A7C00215F0ECEBFC78CAA2DCC16E