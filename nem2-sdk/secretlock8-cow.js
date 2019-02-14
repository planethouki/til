const nem2Sdk = require("nem2-sdk");
const crypto = require("crypto");
const jssha3 = require('js-sha3');
const nem2lib = require("nem2-library");
const request = require('request');

const Address = nem2Sdk.Address,
    Deadline = nem2Sdk.Deadline,
    Account = nem2Sdk.Account,
    UInt64 = nem2Sdk.UInt64,
    NetworkType = nem2Sdk.NetworkType,
    PlainMessage = nem2Sdk.PlainMessage,
    TransferTransaction = nem2Sdk.TransferTransaction,
    Mosaic = nem2Sdk.Mosaic,
    MosaicId = nem2Sdk.MosaicId,
    TransactionHttp = nem2Sdk.TransactionHttp,
    AccountHttp = nem2Sdk.AccountHttp,
    MosaicHttp = nem2Sdk.MosaicHttp,
    NamespaceHttp = nem2Sdk.NamespaceHttp,
    MosaicService = nem2Sdk.MosaicService,
    XEM = nem2Sdk.XEM,
    AggregateTransaction = nem2Sdk.AggregateTransaction,
    PublicAccount = nem2Sdk.PublicAccount,
    LockFundsTransaction = nem2Sdk.LockFundsTransaction,
    Listener = nem2Sdk.Listener,
    CosignatureTransaction = nem2Sdk.CosignatureTransaction,
    SecretLockTransaction = nem2Sdk.SecretLockTransaction,
    SecretProofTransaction = nem2Sdk.SecretProofTransaction,
    HashType = nem2Sdk.HashType;

const sha3_512 = jssha3.sha3_512;
const sha3_256 = jssha3.sha3_256;
const keccak256 = jssha3.keccak256;


function endian(hex) {
    const uint8arr = nem2lib.convert.hexToUint8(hex)
    return nem2lib.convert.uint8ToHex(uint8arr.reverse())
}


// ***************************************************
// CowのSecretLock
// ***************************************************


const random = crypto.randomBytes(32);
const proof = random.toString('hex').toUpperCase();
const hashAlgorithm = "01";

function alg(hashAlgorithm) {
    switch(hashAlgorithm) {
        case "00":
            return sha3_256.create().update(random).hex().toUpperCase();
        case "01":
            return keccak256.create().update(random).hex().toUpperCase();
    }
}
const secret = alg(hashAlgorithm);



console.log(`H(x): ${secret}`)
console.log(`x   : ${proof}`)

const PRIVATE_KEY = "3D116393B9E0F66550914A69A9AB07D827BF8472C083DC6763CD58998D70AEC9"
const ENDPOINT = "http://13.112.187.85:3000";
const RECIPIENT_ADDRESS = "SCA7ZS2B7DEEBGU3THSILYHCRUR32YYE55ZBLYA2"
const keypair = nem2lib.KeyPair.createKeyPairFromPrivateKeyString(PRIVATE_KEY)
const recipient = nem2lib.convert.uint8ToHex(nem2lib.address.stringToAddress(RECIPIENT_ADDRESS))
const mosaicId = "85BBEA6CC462B244"
const amount = "00000000000F4240"
const duration = "0000000000000064"

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


lockTx()
setTimeout(proofTx,15000)