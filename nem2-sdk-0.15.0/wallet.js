const {SimpleWallet, NetworkType, Password} = require('nem2-sdk');

const wallet = SimpleWallet.createFromPrivateKey(
    "Account1",
    new Password("password"),
    "25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E",
    NetworkType.MIJIN_TEST
)

console.log({
    name: wallet.name,
    encryptedKey: wallet.encryptedPrivateKey.encryptedKey,
    iv: wallet.encryptedPrivateKey.iv,
    address: wallet.address.pretty()
})
