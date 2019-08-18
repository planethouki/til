const {
    Account,
    Deadline,
    HashType,
    NetworkType,
    Mosaic,
    MosaicId,
    SecretLockTransaction,
    UInt64
} = require('nem2-sdk')

const {
    sha3_256
} = require('js-sha3')

const crypto = require('crypto')

const random = crypto.randomBytes(10);
const secret = sha3_256.create().update(random).hex().toUpperCase()

const recipient = Account.generateNewAccount(NetworkType.MIJIN_TEST)
const sender = Account.generateNewAccount(NetworkType.MIJIN_TEST)

const secretLockTransaction = SecretLockTransaction.create(
    Deadline.create(),
    new Mosaic(new MosaicId('77A1969932D987D7'), UInt64.fromUint(1000000)),
    UInt64.fromUint(960),
    HashType.Op_Sha3_256,
    secret,
    recipient.address,
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(20000)
)

const signedTransaction = sender.sign(secretLockTransaction, '')
console.log(signedTransaction.payload)
console.log(recipient.publicKey)
console.log(recipient.address.plain())
console.log(sender.privateKey)
console.log(sender.publicKey)

// CA000000D680FEDFE00056B12B19DED7E104A809DB8025DBC130D9ED69B031FD997EF8B0FA18B884E9C872DFFE2DCBCF34AAEECDC3EFF4B7EE0257D2392123047EB71E02B5B2ADB6EE3FC77AB04DD0BF6676491E8D1B5B5EBAA832509BFE4CFDA5BDEBA201905241204E0000000000005C7877AC18000000D787D9329996A17740420F0000000000C00300000000000000DA85ABA910EAC1E0FEFD4BFCF73226CACAED694CA942DA6450FE19A64AD2C04A90E78A63AF27F41EBFC92B3E8EBBC0EE6BC7C21D4B05A11A73
// B6D507FC4656CA4D9460908E826082D2520B73247EC2F1F5A362B2A27AB36AFD
// SDTYUY5PE72B5P6JFM7I5O6A5ZV4PQQ5JMC2CGTT
// 8BAFFAE84C3338C89E413EF2AFE36888E9F08EA7DADF3593F209B77C6614B4DE
// B5B2ADB6EE3FC77AB04DD0BF6676491E8D1B5B5EBAA832509BFE4CFDA5BDEBA2