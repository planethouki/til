const nem2Sdk = require("nem2-sdk");
const crypto = require("crypto");
const jssha3 = require('js-sha3');
const nem2lib = require("nem2-library");
const request = require('request');
const op = require('rxjs/operators');
const rx = require('rxjs');

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

const privateKey = '3D116393B9E0F66550914A69A9AB07D827BF8472C083DC6763CD58998D70AEC9';
const account = Account.createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST);

const recipientAccount = Account.generateNewAccount(NetworkType.MIJIN_TEST);
const recipientAddress = recipientAccount.address;

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    recipientAddress,
    [XEM.createRelative(0)],
    PlainMessage.create(''),
    NetworkType.MIJIN_TEST,
);

const tx1Signed = account.sign(transferTransaction);

// console.log('tx1Signed.hash   : ' + tx1Signed.hash);
// console.log('tx1Signed.signer : ' + tx1Signed.signer);
console.log(`tx1Signed.payload: ${tx1Signed.payload}`);

function endian(hex) {
    const uint8arr = nem2lib.convert.hexToUint8(hex)
    return nem2lib.convert.uint8ToHex(uint8arr.reverse())
}

const mosaicId = (new MosaicId([3294802500,2243684972])).toHex().toUpperCase();
console.log(mosaicId);
const txPayload = 
    tx1Signed.payload.substr(0, tx1Signed.payload.length - 32) +
    endian(mosaicId) + 
    endian("00000000000F4240");
console.log(`hashLockTxPayload: ${txPayload}`);

const txPayloadSigningBytes = txPayload.substr(100*2);
const keypair = nem2lib.KeyPair.createKeyPairFromPrivateKeyString(privateKey);
const signatureByte = nem2lib.KeyPair.sign(keypair, txPayloadSigningBytes);
const signature = nem2lib.convert.uint8ToHex(signatureByte);

// console.log('publicKey: ' + nem2lib.convert.uint8ToHex(keypair.publicKey));
// console.log('signature: ' + nem2lib.convert.uint8ToHex(signatureByte));

const signedTxPayload =
    txPayload.substr(0,4*2) +
    signature +
    txPayload.substr((4+64)*2);

console.log(`signedTxPayload: ${signedTxPayload}`);

const hashInputPayload = 
    signedTxPayload.substr(4*2,32*2) +
    signedTxPayload.substr((4+64)*2,32*2) +
    signedTxPayload.substr((4+64+32)*2);
const signedTxHash = sha3_256.create().update(Buffer.from(hashInputPayload, 'hex')).hex().toUpperCase();
console.log(`signedTxHash: ${signedTxHash}`);

// const ENDPOINT = "http://catapult48gh23s.xyz:3000";
const ENDPOINT = "http://13.112.187.85:3000";
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