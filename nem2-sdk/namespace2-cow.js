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
    HashType = nem2Sdk.HashType
    NamespaceId = nem2Sdk.NamespaceId;

const sha3_512 = jssha3.sha3_512;
const sha3_256 = jssha3.sha3_256;

const publicKey = 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF';
const account = PublicAccount.createFromPublicKey(publicKey, NetworkType.MIJIN_TEST);

// cat (B1497F5FBA651B4F)
// cat.harvest (941299B2B7E1291C)
// cat.currency (85BBEA6CC462B244)

const namespaceIdNem = new NamespaceId("cat");
console.log(`cat: ${namespaceIdNem.toHex()} ${namespaceIdNem.id.toDTO()}`)
// cat: 31497f5fba651b4f 3127188303,826900319

function endian(hex) {
    const uint8arr = nem2lib.convert.hexToUint8(hex)
    return nem2lib.convert.uint8ToHex(uint8arr.reverse())
}

function generateHash(hex) {
    const hash = sha3_256.create();
    hash.update(Buffer.from(hex, 'hex'));
    return hash.hex().toUpperCase();
}

const cat = "636174"
const hoge = generateHash(endian("0000000000000000") + cat)
console.log(hoge.substring(0,16))
console.log(endian(hoge.substring(8,16)) + "," + endian(hoge.substring(0,8)))
// 4F1B65BA5F7F4931
// 31497F5F,BA651B4F



const namespaceIdCatHarvest = new NamespaceId("cat.harvest");
console.log(`cat.harvest: ${namespaceIdCatHarvest.toHex()} ${namespaceIdCatHarvest.id.toDTO()}`)
// cat.harvest: 910c36e6f4059248 4094005832,2433496806

const namespaceIdCatCurrency = new NamespaceId("cat.currency");
console.log(`cat.currency: ${namespaceIdCatCurrency.toHex()} ${namespaceIdCatCurrency.id.toDTO()}`)
// cat.currency: 690060d85a0e7c1e 1510898718,1761632472


const harvest = "68617276657374"
const fuga = generateHash(endian("B1497F5FBA651B4F") + harvest)
console.log(fuga.substring(0,16))
console.log(endian(fuga.substring(8,16)) + "," + endian(fuga.substring(0,8)))
// 1C29E1B7B2991294
// 941299B2,B7E1291C

const currency = "63757272656E6379"
const piyo = generateHash(endian("B1497F5FBA651B4F") + currency)
console.log(piyo.substring(0,16))
console.log(endian(piyo.substring(8,16)) + "," + endian(piyo.substring(0,8)))
// 44B262C46CEABB05
// 05BBEA6C,C462B244