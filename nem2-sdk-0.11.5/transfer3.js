process.env.PRIVATE_KEY = '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E';
process.env.NODE_URL = 'http://fushicho2.48gh23s.xyz:3000';
process.env.GENERATION_HASH = '8D2F8F41FF5C92F9B667C9ABFF1F516AD2DAE9E8D256C0A7C5BF631E9181CACB';

const nem2Sdk = require("nem2-sdk");
const crypto = require("crypto");
const jssha3 = require('js-sha3');
const nem2lib = require("nem2-library");
const request = require('request');

const sha3_512 = jssha3.sha3_512;
const sha3_256 = jssha3.sha3_256;

const Address = nem2Sdk.Address,
    Deadline = nem2Sdk.Deadline,
    Account = nem2Sdk.Account,
    UInt64 = nem2Sdk.UInt64,
    NetworkType = nem2Sdk.NetworkType,
    PlainMessage = nem2Sdk.PlainMessage,
    TransferTransaction = nem2Sdk.TransferTransaction,
    Mosaic = nem2Sdk.Mosaic,
    MosaicId = nem2Sdk.MosaicId,
    NamespaceId = nem2Sdk.NamespaceId,
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
    HashType = nem2Sdk.HashType,
    NetworkCurrencyMosaic = nem2Sdk.NetworkCurrencyMosaic;

const nemesisGenerationHash = process.env.GENERATION_HASH;

const privateKey = process.env.PRIVATE_KEY;

function toLE(hex) {
    const uint8arr = nem2lib.convert.hexToUint8(hex)
    return nem2lib.convert.uint8ToHex(uint8arr.reverse())
}

const txPayload =
  'A5000000'
  + '9140123A4932B66072A6AAC636548B2C8BF8204EA90FE7C74A80798CDF8A3754DE16DA018CB9B42D239DFD573BC2B125E9BDA84D3B18600FABE5C1F85DE91207'
  + 'AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26'
  + '0190'
  + '5441'
  + '0000000000000000'
  + toLE(new UInt64(Deadline.create().toDTO()).toHex())
  + '90FA39EC47E05600AFA74308A7EA607D145E371B5F4F1447BC'
  + '0100'
  + '0100'
  + '85BBEA6CC462B244'
  + '0000000000000000'

const txPayloadSigningBytes = nemesisGenerationHash + txPayload.substr(100*2);
const keypair = nem2lib.KeyPair.createKeyPairFromPrivateKeyString(privateKey);
const signatureByte = nem2lib.KeyPair.sign(keypair, txPayloadSigningBytes);
const signature = nem2lib.convert.uint8ToHex(signatureByte);

// console.log('publicKey: ' + nem2lib.convert.uint8ToHex(keypair.publicKey));
// console.log('signature: ' + nem2lib.convert.uint8ToHex(signatureByte));

const signedTxPayload =
    txPayload.substr(0,4*2) +
    signature +
    txPayload.substr((4+64)*2);

// console.log(`signedTxPayload: ${signedTxPayload}`);

const hashInputPayload = 
    signedTxPayload.substr(4*2,32*2) +
    signedTxPayload.substr((4+64)*2,32*2) +
    nemesisGenerationHash +
    signedTxPayload.substr((4+64+32)*2);
const signedTxHash = sha3_256.create().update(Buffer.from(hashInputPayload, 'hex')).hex().toUpperCase();
console.log(`signedTxHash: ${signedTxHash}`);

const ENDPOINT = process.env.NODE_URL;
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