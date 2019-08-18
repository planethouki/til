const {
    Account,
    Deadline,
    HashType,
    NetworkType,
    SecretProofTransaction,
    UInt64
} = require('nem2-sdk')

const {
    sha3_256
} = require('js-sha3')

const crypto = require('crypto')

const random = crypto.randomBytes(10);
const secret = sha3_256.create().update(random).hex().toUpperCase()
const proof = random.toString('hex').toUpperCase()

const recipient = Account.generateNewAccount(NetworkType.MIJIN_TEST)
const sender = Account.generateNewAccount(NetworkType.MIJIN_TEST)

const secretProofTransaction = SecretProofTransaction.create(
    Deadline.create(),
    HashType.Op_Sha3_256,
    secret,
    recipient.address,
    proof,
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(20000)
)

const signedTransaction = sender.sign(secretProofTransaction, '')
console.log(signedTransaction.payload)
console.log(recipient.publicKey)
console.log(recipient.address.plain())
console.log(sender.privateKey)
console.log(sender.publicKey)

// BE0000000F9B435E3D6E74E41C38452F1370013FF0CD98BB9EF327C72BE7EBCEB19D4E71D42D60CA2DCF4F3EEE039FF36427B4F8346D23BB33D99939446E9E313DFFEF06B9F21F2E55187AA24B1CF2746E7ECE1B0B62532E273AEAFEEAE2093228BF012101905242204E0000000000009CB077AC1800000000A2A4A2B87F53C3B4A65D93F03565AA3F12C92BB89C0E06741913FCC56BC17A6A908C59129D1D197E861990CAB26219B4D2EC96DCEAA857CBC80A00576739CDDF9DB9A6DE66
// B5B6FB527B200D60530B9B234E9DEEC51EED175EEA58F69B0902827F2ABEC6B4
// SCGFSEU5DUMX5BQZSDFLEYQZWTJOZFW45KUFPS6I
// 9FE7AC0A4AFA8FBBAD013AF418ECE710712C2F3BA7C60D03C13BAEE7E66AAB58
// B9F21F2E55187AA24B1CF2746E7ECE1B0B62532E273AEAFEEAE2093228BF0121
