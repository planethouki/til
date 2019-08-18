const {
    Account,
    Deadline,
    NetworkType,
    MosaicNonce,
    MosaicId,
    MosaicSupplyChangeTransaction,
    MosaicSupplyType,
    UInt64
 } = require('nem2-sdk')

const sender = Account.generateNewAccount(NetworkType.MIJIN_TEST)
const nonce = MosaicNonce.createRandom()

const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
    Deadline.create(),
    MosaicId.createFromNonce(nonce, sender.publicAccount),
    MosaicSupplyType.Increase,
    UInt64.fromUint(1000000),
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(20000)
)

const signedTransaction = sender.sign(mosaicSupplyChangeTransaction, '')
console.log(signedTransaction.payload)
console.log(sender.privateKey)
console.log(sender.publicKey)
console.log(Buffer.from(nonce.nonce).toString('hex').toUpperCase())

// 8900000021B1346EF0FADB1016CA725D30C1A67ECFF839FA02AE7A6AE0095433F35F6B27174FA277D7624432C756093CDFD573807587CB779F1D4E66F92F22E5E8AB52008673C06AE0069A3D856CA7AB96E30205A13485460EB0876B2A66BA8188C3405001904D42204E000000000000C1EE2AAD1800000029E42E1BB4EEAA590140420F0000000000
// E326B87E1F40BD134F42C087EEF582CD35A41F7EB75E7A82D5ACADCA05566F01
// 8673C06AE0069A3D856CA7AB96E30205A13485460EB0876B2A66BA8188C34050
// ADC23C56