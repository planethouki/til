const {
    Account,
    Deadline,
    NetworkType,
    MosaicId,
    MosaicNonce,
    MosaicGlobalRestrictionTransaction,
    MosaicRestrictionType,
    UInt64
 } = require('nem2-sdk')

const recipient = Account.generateNewAccount(NetworkType.MIJIN_TEST)
const sender = Account.generateNewAccount(NetworkType.MIJIN_TEST)
const nonce = MosaicNonce.createRandom()
const mosaicId = MosaicId.createFromNonce(nonce, sender.publicAccount)
const restrictionKey = UInt64.fromUint(15)
const previousRestrictionValue = UInt64.fromUint(233)
const newRestrictionValue = UInt64.fromUint(866)

const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction.create(
    Deadline.create(),
    mosaicId,
    mosaicId,
    restrictionKey,
    previousRestrictionValue,
    MosaicRestrictionType.EQ,
    newRestrictionValue,
    MosaicRestrictionType.EQ,
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(20000)
)

const signedTransaction = sender.sign(mosaicGlobalRestrictionTransaction, '')
console.log(signedTransaction.payload)
console.log(recipient.address.plain())
console.log(sender.privateKey)
console.log(sender.publicKey)


