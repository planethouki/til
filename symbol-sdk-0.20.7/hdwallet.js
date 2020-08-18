const hd = require('symbol-hd-wallets')
const { NetworkType } = require('symbol-sdk')

const mnemonic = hd.MnemonicPassPhrase.createRandom()
console.log(mnemonic.plain)
const wallet = new hd.Wallet(hd.ExtendedKey.createFromSeed(mnemonic.toSeed(), hd.Network.CATAPULT_PUBLIC))
console.log(wallet.getChildAccount("m/44'/43'/0'/0/0", NetworkType.TEST_NET).address.plain())
console.log(wallet.getChildAccount("m/44'/43'/0'/0/1", NetworkType.TEST_NET).address.plain())