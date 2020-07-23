const { Account, NetworkType, PublicAccount } = require('symbol-sdk')

const account = Account.createFromPrivateKey(
    '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E',
    NetworkType.TEST_NET
)

console.log(account.publicAccount.publicKey)
console.log(account.address.plain())

const publicAccount = PublicAccount.createFromPublicKey(
    '0B5FE83A964B07D9E056F0AD6F22178FB707EF0F8825D5FCA76663C0E16AFB78',
    NetworkType.TEST_NET
)

console.log(publicAccount.address.plain())