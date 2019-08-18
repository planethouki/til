const {
    Account,
    Deadline,
    NetworkType,
    MosaicDefinitionTransaction,
    MosaicNonce,
    MosaicId,
    MosaicProperties,
    UInt64
 } = require('nem2-sdk')

const sender = Account.generateNewAccount(NetworkType.MIJIN_TEST)
const nonce = MosaicNonce.createRandom()

const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
    Deadline.create(),
    nonce,
    MosaicId.createFromNonce(nonce, sender.publicAccount),
    MosaicProperties.create({        
        supplyMutable: true,
        transferable: true,
        divisibility: 0,
        duration: UInt64.fromUint(1000)
    }),
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(20000)
)

const signedTransaction = sender.sign(mosaicDefinitionTransaction, '')
console.log(signedTransaction.payload)
console.log(sender.privateKey)
console.log(sender.publicKey)
console.log(Buffer.from(nonce.nonce).toString('hex').toUpperCase())

// 9000000007D62C2FE05C8CEE90306D560E389CB274E37637CA58F3360E1750F0BFAAEEF0E3D7BB4D69B3C4B53D2BE461D1A6163594EF55DBFF678ABBCDF3D49D8EFA350E18EAB966209DD02200E7C14B5FE7622C64341BC08B17388E3016324986B5B81001904D41204E000000000000368F1CAC18000000C15B7110D92BB4432819F67101030002E803000000000000
// DD73563DAF15B8C9A2C54866368BB01A11BA5FB8CF3E4245900BB45EBFA3AD42
// 18EAB966209DD02200E7C14B5FE7622C64341BC08B17388E3016324986B5B810
// C15B7110