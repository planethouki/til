const jssha3 = require('js-sha3');
const nem2lib = require("nem2-library");
const request = require('request');

const sha3_256 = jssha3.sha3_256;
const keccak256 = jssha3.keccak256;


function endian(hex) {
    const uint8arr = nem2lib.convert.hexToUint8(hex)
    return nem2lib.convert.uint8ToHex(uint8arr.reverse())
}

const proof = "28D0A13C6ABAAB59A1EB94C6250FAE325C37C9B1EF2A7D9B37CEECFE59B84AB3"
const hashAlgorithm = "01";
const secret = "48DC79553781ED80927E14609C3F256D17D802A7C88C6505AD14AF28F0131599"

const PRIVATE_KEY = "25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E"
const ENDPOINT = "http://13.112.187.85:3000";
const RECIPIENT_ADDRESS = "SBWUUQYUPEVBZSQ3DQOPAZM2IPET7UY6TGPXPX34"
const keypair = nem2lib.KeyPair.createKeyPairFromPrivateKeyString(PRIVATE_KEY)
const recipient = nem2lib.convert.uint8ToHex(nem2lib.address.stringToAddress(RECIPIENT_ADDRESS))
const mosaicId = "85BBEA6CC462B244"     // cat.currency
const amount = "0000000005F5E100"       // 100000000
const duration = "00000000000003E8"     // 1000

function lockTx() {

    const txPayload = 
        "CA000000" +
        "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" +
        nem2lib.convert.uint8ToHex(keypair.publicKey) +
        "0190" + "5241" + "0000000000000000" +
        nem2lib.convert.uint8ToHex(new Uint8Array(new Uint32Array(nem2lib.deadline(2 * 60 * 60 * 1000)).buffer)) +
        endian(mosaicId) +
        endian(amount) +
        endian(duration) +
        hashAlgorithm +                    // hashtype
        secret +                        // secret
        recipient                        // recipient

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

    request({
        url: `${ENDPOINT}/transaction`,
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        json: {"payload": signedTxPayload}
    }, (error, response, body) => {
        console.log(body);
    });

}



lockTx()