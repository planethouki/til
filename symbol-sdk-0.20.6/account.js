const { 
    Account,
    Convert,
    NetworkType,
    KeyPair
} = require('symbol-sdk');

const networkType = NetworkType.TEST_NET

const initiator = Account.createFromPrivateKey(
    '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E',
    networkType
)

// const initiator = Account.generateNewAccount(networkType)

console.log(initiator.privateKey)
console.log(initiator.address.plain())
console.log(initiator.address.pretty())
console.log(initiator.publicAccount.publicKey)
