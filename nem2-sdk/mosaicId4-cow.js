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

const publicKey = 'AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26';

// publicKey = B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF
// currencyMosaicId = 0x0DC6'7FBE'1CAD'29E3
// harvestingMosaicId = 0x2651'4E2A'1EF3'3824

// cat:currency (119E15661E9B2758)
// Owner: 7F78559C556642FE132616910B1C9F2C36BC144D2D3A9E909092D64A0D0DE0DE
// cat:harvest (2AECBFD76AE7411B)
// Owner: 7F78559C556642FE132616910B1C9F2C36BC144D2D3A9E909092D64A0D0DE0DE


function endian(hex) {
    const uint8arr = nem2lib.convert.hexToUint8(hex)
    return nem2lib.convert.uint8ToHex(uint8arr.reverse())
}

function generateHash(hex) {
    const hash = sha3_256.create();
    hash.update(Buffer.from(hex, 'hex'));
    return hash.hex().toUpperCase();
}
function numberToHex4(input) {
    const hex = input.toString(16)
    return '0000000'.concat(hex).substr(-8)
}


const hoge = generateHash(endian(numberToHex4(256)) + publicKey)
const hoge16 = hoge.substring(0,16)
console.log(hoge16)
const hogeSplit1 = endian(hoge.substring(8,16))
const hogeSplit2 = endian(hoge.substring(0,8))
console.log(hogeSplit1 + "," + hogeSplit2)
console.log(Number("0x" + hogeSplit1) & 0x7FFFFFFF)
console.log(Number("0x" + hogeSplit2))
