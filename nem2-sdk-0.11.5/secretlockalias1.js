process.env.PRIVATE_KEY = '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E';
process.env.NODE_URL = 'http://54.178.241.129:3000'

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

const recipientAddress = Address.createFromRawAddress('SD5DT3-CH4BLA-BL5HIM-EKP2TA-PUKF4N-Y3L5HR-IR54');

const random = crypto.randomBytes(10);
const secret256 = jssha3.sha3_256.create().update(random).hex().toUpperCase();
const proof = random.toString('hex');
console.log(proof);

const secretLockTransaction = SecretLockTransaction.create(
    Deadline.create(),
    NetworkCurrencyMosaic.createRelative(10),
    UInt64.fromUint(60), //officially 96h
    HashType.Op_Sha3_256,
    secret256,
    recipientAddress, // send to bob public
    NetworkType.MIJIN_TEST
);


const account = Account.createFromPrivateKey(process.env.PRIVATE_KEY, NetworkType.MIJIN_TEST);

const signedTransaction = account.sign(secretLockTransaction);

console.log(signedTransaction);

// const txPayload = 
//     "CA000000" +
//     "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" +
//     "AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26" +
//     "0190" + "5241" + "0000000000000000" +
//     nem2lib.convert.uint8ToHex(new Uint8Array(new Uint32Array(nem2lib.deadline(2 * 60 * 60 * 1000)).buffer)) +
//     "44B262C46CEABB85" + "8096980000000000" + "3C00000000000000" + "00" +
//     secret256 +
//     nem2lib.convert.uint8ToHex(nem2lib.address.stringToAddress(recipientAddress.plain()));
const aliceAlias = new NamespaceId("alice");
function endian(hex) {
    const uint8arr = nem2lib.convert.hexToUint8(hex)
    return nem2lib.convert.uint8ToHex(uint8arr.reverse())
}
const txPayload = 
    signedTransaction.payload.substring(0, 354) +
    "91" + endian(aliceAlias.toHex()) + "00000000000000000000000000000000";
const txPayloadSigningBytes = txPayload.substr(100*2)
const keypair = nem2lib.KeyPair.createKeyPairFromPrivateKeyString(process.env.PRIVATE_KEY)
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
    jssha3.sha3_256.create().update(Buffer.from(hashInputPayload, 'hex')).hex().toUpperCase()

console.log(txPayload);
console.log(signedTxPayload);


request({
    url: `${process.env.NODE_URL}/transaction`,
    method: 'PUT',
    headers: {
        'Content-Type':'application/json'
    },
    json: {"payload": signedTxPayload}
}, (error, response, body) => {
    console.log(body);
});

/*
CA000000
46C32228092C45A683A45F1896A96362537A8F00B382C754E7C6C7CFC5AEC28318F18D9D1E78B2E686316F9B408A3C446056305C677D642570DD92B9A30C4B0F
AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26
0190
5241
0000000000000000
16261F9916000000
44B262C46CEABB85
8096980000000000
3C00000000000000
00
E7087DD0638AB68895DBEA87FC7DD2F54114E6467CB48B0E6BC455DED7D68E0C
90FA39EC47E05600AFA74308A7EA607D145E371B5F4F1447BC
*/

// const transactionHttp = new TransactionHttp(process.env.NODE_URL);

// transactionHttp
//     .announce(signedTransaction)
//     .subscribe(x => console.log(x), err => console.error(err));