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

const mosaicXEM = XEM.createAbsolute(0)
console.log(`xem: ${mosaicXEM.id.toHex()} ${mosaicXEM.id.id.toDTO()}`)
// xem: d525ad41d95fcf29 3646934825,3576016193

function endian(hex) {
    const uint8arr = nem2lib.convert.hexToUint8(hex)
    return nem2lib.convert.uint8ToHex(uint8arr.reverse())
}

function generateHash(hex) {
    const hash = sha3_256.create();
    hash.update(Buffer.from(hex, 'hex'));
    return hash.hex().toUpperCase();
}

// nem: 84b3552d375ffa4b 929036875,2226345261
const xem = "78656d"
const hoge = generateHash(endian("84b3552d375ffa4b") + xem)
console.log(hoge.substring(0,16))
console.log(endian(hoge.substring(8,16)) + "," + endian(hoge.substring(0,8)))
// 29CF5FD941AD25D5
// D525AD41,D95FCF29