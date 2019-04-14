const bip32 = require('bip32')
const bip39 = require('bip39')
const { NEMLibrary, NetworkTypes, Account } = require('nem-library')
const { derivePath, getMasterKeyFromSeed, getPublicKey } = require('ed25519-hd-key')

const mnemonic = 'average video hand unknown load ketchup flavor deny buffalo photo skull sad young across vanish skull purity canvas clump ensure siege girl scrub wagon'
const seed = bip39.mnemonicToSeedSync(mnemonic)
const root = bip32.fromSeed(seed)
const path = "m/44'/43'/0'/0'"
const child1 = root.derivePath(path)
const privateKey = child1.privateKey.toString('hex')

NEMLibrary.bootstrap(NetworkTypes.MAIN_NET)
function exec(p) {
    const account = Account.createWithPrivateKey(p)
    console.log(account.privateKey, account.publicKey, account.address.pretty())
}


exec(privateKey)

const hexSeed = seed.toString('hex')
const { key, chainCode } = derivePath(path, hexSeed)
exec(key.toString('hex'))

