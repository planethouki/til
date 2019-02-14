const nem2Sdk = require("nem2-sdk");
const crypto = require("crypto");
const jssha3 = require('js-sha3');
const nem2lib = require("nem2-library");
const request = require('request');

const sha3_256 = jssha3.sha3_256;
const keccak256 = jssha3.keccak256;

const proof = "28D0A13C6ABAAB59A1EB94C6250FAE325C37C9B1EF2A7D9B37CEECFE59B84AB3"
const hashAlgorithm = "01";
const secret = "48DC79553781ED80927E14609C3F256D17D802A7C88C6505AD14AF28F0131599"

const PRIVATE_KEY = "1B31F0BBB87891E747501C2B79103F986BD6F0B12B892EB0ACFB78ADBF9B3DF1"
const ENDPOINT = "http://13.112.187.85:3000";
const keypair = nem2lib.KeyPair.createKeyPairFromPrivateKeyString(PRIVATE_KEY)

function proofTx() {
    const txPayload = 
        "BB000000" +
        "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" +
        nem2lib.convert.uint8ToHex(keypair.publicKey) +
        "0190" + "5242" + "0000000000000000" +
        nem2lib.convert.uint8ToHex(new Uint8Array(new Uint32Array(nem2lib.deadline(2 * 60 * 60 * 1000)).buffer)) +
        hashAlgorithm +
        secret +
        "2000" +
        proof

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

proofTx()