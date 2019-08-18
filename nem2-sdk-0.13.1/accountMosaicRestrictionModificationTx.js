const {
    Account,
    AccountMosaicRestrictionModificationTransaction,
    AccountRestrictionModification,
    AccountRestrictionTransaction,
    Deadline,
    MosaicId,
    MosaicNonce,
    NetworkType,
    RestrictionModificationType,
    RestrictionType,
    UInt64
 } = require('nem2-sdk')

const sender = Account.generateNewAccount(NetworkType.MIJIN_TEST)
const nonce = MosaicNonce.createRandom()

const accountMosaicRestrictionModificationTransaction = AccountMosaicRestrictionModificationTransaction.create(
    Deadline.create(),
    RestrictionType.AllowMosaic,
    [
        AccountRestrictionModification.createForMosaic(
            RestrictionModificationType.add,
            MosaicId.createFromNonce(nonce, sender.publicAccount)
        )
    ],
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(20000)
)

const signedTransaction = sender.sign(accountMosaicRestrictionModificationTransaction, '')
console.log(signedTransaction.payload)
console.log(sender.privateKey)
console.log(sender.publicKey)

// 83000000DFD8FB2A44424195068A460421BA8CB4AF35621D0219C7E3D5259196C59AF3BD7FEF9AFD5A900509B27F6B9A281DAC9C542C8794B7EE9E864D46BCCD8194F90D99F57E7A7551034CE50999BEA627606B30DF139260B0402F79020652ED7FBEB201905042204E00000000000088E266B118000000020100C0BB527FA8BF2816
// B0A3BD2C1EA9D5303CD73359B7CD8D81DCCC85FF7DEF97EBE7F5C9635A132D70
// 99F57E7A7551034CE50999BEA627606B30DF139260B0402F79020652ED7FBEB2

const accountRestrictionTransaction = AccountRestrictionTransaction
    .createMosaicRestrictionModificationTransaction(
        Deadline.create(),
        RestrictionType.AllowMosaic,
        [
            AccountRestrictionModification.createForMosaic(
                RestrictionModificationType.add,
                MosaicId.createFromNonce(nonce, sender.publicAccount)
            )
        ],
        NetworkType.MIJIN_TEST,
        UInt64.fromUint(20000)
    )

const signedTransaction2 = sender.sign(accountRestrictionTransaction, '')
console.log(signedTransaction2.payload)

// 830000006E4018258FE28ACDA9A71C46D088386CFEC868991422A69FC56D72B4FFF8E3E51B78EF0BC4B08B103418E5A63DC4A94F06EE3D2C2151577757E6C28309E6200B99F57E7A7551034CE50999BEA627606B30DF139260B0402F79020652ED7FBEB201905042204E0000000000009EE266B118000000020100C0BB527FA8BF2816
