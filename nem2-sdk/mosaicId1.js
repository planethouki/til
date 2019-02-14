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

const publicKey = 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF';
const account = PublicAccount.createFromPublicKey(publicKey, NetworkType.MIJIN_TEST);

function endian(hex) {
    const uint8arr = nem2lib.convert.hexToUint8(hex)
    return nem2lib.convert.uint8ToHex(uint8arr.reverse())
}

const basicMosaicInfo = {
	nonce: [0x78, 0xE3, 0x6F, 0xB7],
	publicId: [
		0x4A, 0xFF, 0x7B, 0x4B, 0xA8, 0xC1, 0xC2, 0x6A, 0x79, 0x17, 0x57, 0x59, 0x93, 0x34, 0x66, 0x27,
		0xCB, 0x6C, 0x80, 0xDE, 0x62, 0xCD, 0x92, 0xF7, 0xF9, 0xAE, 0xDB, 0x70, 0x64, 0xA3, 0xDE, 0x62
	],
	id: [0xC0AFC518, 0x3AD842A8]
};

// console.log(generateId(basicMosaicInfo.nonce, basicMosaicInfo.publicId))
// console.log(generateId(
//     Buffer.from("78E36FB7", 'hex'),
//     Buffer.from("4AFF7B4BA8C1C26A7917575993346627CB6C80DE62CD92F7F9AEDB7064A3DE62", 'hex')
// ))
// console.log(basicMosaicInfo.id)
console.log(generateId(
    Buffer.from("00000000", 'hex'),
    Buffer.from("B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF", 'hex')
))
console.log([0x1CAD29E3, 0x0DC67FBE])
console.log(generateId(
    Buffer.from("01000000", 'hex'),
    Buffer.from("B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF", 'hex')
))
console.log([0x1EF33824, 0x26514E2A])

console.log(generateHash("00000000B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF"))

function generateId(nonce, ownerPublicId) {
    const hash = sha3_256.create();
    hash.update(nonce);
    hash.update(ownerPublicId);
    const result = new Uint32Array(hash.arrayBuffer());
    return [result[0], result[1] & 0x7FFFFFFF];
}

function generateHash(hex) {
    const hash = sha3_256.create();
    hash.update(Buffer.from(hex, 'hex'));
    return hash.hex().toUpperCase();
}
function generateMosaicIdFromHex(nonce, ownerPublicId) {
    const hash = sha3_256.create();
    hash.update(Buffer.from(nonce + ownerPublicId, 'hex'));
    const result = new Uint32Array(hash.arrayBuffer());
    const rowId = [result[0], result[1] & 0x7FFFFFFF];
    rowId.map(x => {
        const y = x.toString(16);
    })
}