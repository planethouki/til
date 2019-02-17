
const nem2lib = require('nem2-library')
const sha3_256 = require('js-sha3').sha3_256
const request = require('request')

const privateKey = "25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E"
const keypair = nem2lib.KeyPair.createKeyPairFromPrivateKeyString(privateKey)
const uint8address = nem2lib.address.publicKeyToAddress(keypair.publicKey, 0x90);
console.log(nem2lib.convert.uint8ToHex(uint8address))
console.log(nem2lib.address.addressToString(uint8address))