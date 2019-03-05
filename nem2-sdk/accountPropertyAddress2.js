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

const privateKey = '42A932B6204B61C975719C6AB1B9FC4B11B6903754F87A63B0A05EB892488B89';
const account = Account.createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST);

const blockedAccount = Account.generateNewAccount(NetworkType.MIJIN_TEST);
const blockedAddress = blockedAccount.address;
const blockedAddressDecoded = nem2lib.convert.uint8ToHex(nem2lib.address.stringToAddress(blockedAddress.plain()));

console.log(`generated privkey: ${blockedAccount.privateKey}`);

// ***************************************************
// Cow Account Property Address
// ***************************************************

const proof = "25DC8F222E8500EC0E93";
const secret = "7448C0D4E2FE58A22BD1AF95282C855EBF4AD7A2B36643A2ADA679DBBACAB078A91CF0AA58600860799EFE2BDC2CBB667376C88E1D4DAF9296963522BF7EC66E";

const tx1 = SecretProofTransaction.create(
    Deadline.create(),
    HashType.SHA3_512,
    secret,
    proof,
    NetworkType.MIJIN_TEST
);

const tx1Signed = account.sign(tx1);

// console.log('tx1Signed.hash   : ' + tx1Signed.hash);
// console.log('tx1Signed.signer : ' + tx1Signed.signer);
// console.log(`tx1Signed.payload: ${tx1Signed.payload}`);

const txPayload = 
    "94000000" +                                        // size
    tx1Signed.payload.substr((4)*2,(64+32)*2) +      // sign + pubkey
    "0190" +                                        // version
    "5041" +                                            // type
    tx1Signed.payload.substr((4+64+32+2+2)*2,(8+8)*2) +      // fee + deadline
    "81" +                                              // propertyType
    "01" +                                                    // propertiesCount
    "00" +                                            // modificationType
    blockedAddressDecoded;         // address decoded
    
// console.log(`hashLockTxPayload: ${secretLockTxPayload}`);

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

const ENDPOINT = "http://54.178.241.129:3000";

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