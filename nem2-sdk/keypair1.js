
const nem2lib = require('nem2-library')
const nem2Sdk = require("nem2-sdk")
const Account = nem2Sdk.Account,
    Address = nem2Sdk.Address,
    Deadline = nem2Sdk.Deadline,
    NetworkType = nem2Sdk.NetworkType,
    Id = nem2Sdk.Id
const sha3_256 = require('js-sha3').sha3_256


function endian(hex) {
    const uint8arr = nem2lib.convert.hexToUint8(hex)
    return nem2lib.convert.uint8ToHex(uint8arr.reverse())
}

const PRIVATE_KEY = "25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E"
const ENDPOINT = "http://catapult48gh23s.xyz:3000"
const keypair = nem2lib.KeyPair.createKeyPairFromPrivateKeyString(PRIVATE_KEY)
const recipient = nem2lib.convert.uint8ToHex(nem2lib.address.stringToAddress("SB2Y5ND4FDLBIO5KHXTKRWODDG2QHIN73DTYT2PC"))
const mosaicId = "D525AD41D95FCF29"
const amount = "00000000000F4240"
const txPayload = 
    "A5000000" +
    "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" +
    nem2lib.convert.uint8ToHex(keypair.publicKey) +
    "039054410000000000000000" +
    nem2lib.convert.uint8ToHex(new Uint8Array(new Uint32Array(nem2lib.deadline(2 * 60 * 60 * 1000)).buffer)) +
    recipient +
    "01000100" +
    endian(mosaicId) +
    endian(amount)
const txPayloadSigningBytes = txPayload.substr(100*2)
const signatureByte = nem2lib.KeyPair.sign(keypair, txPayloadSigningBytes)
const signature = nem2lib.convert.uint8ToHex(signatureByte)

const signedTxPayload =
    txPayload.substr(0,4*2) +
    signature +
    txPayload.substr((4+64)*2)

const hashInputPayload = 
    signedTxPayload.substr(4*2,32*2) +
    signedTxPayload.substr((4+64)*2,32*2) +
    signedTxPayload.substr((4+64+32)*2);
const signedTxHash = 
    sha3_256.create().update(Buffer.from(hashInputPayload, 'hex')).hex().toUpperCase()


console.log(nem2lib.convert.uint8ToHex(new Uint8Array(new Uint32Array(nem2lib.deadline(2 * 60 * 60 * 1000)).buffer)))
console.log(endian((new Id(Deadline.create().toDTO())).toHex().toUpperCase()))


console.log(nem2lib.deadline(2 * 60 * 60 * 1000))
console.log(Deadline.create().toDTO())