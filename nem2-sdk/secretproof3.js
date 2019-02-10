const nem2Sdk = require("nem2-sdk");
const crypto = require("crypto");
const jssha3 = require('js-sha3');
const nem2lib = require("nem2-library");

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

const alicePrivateKeyPublic = '7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4';
const aliceAccountPublic = Account.createFromPrivateKey(alicePrivateKeyPublic, NetworkType.MIJIN_TEST);

const bobPrivateKeyPublic = '31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E';
const bobAccountPublic = Account.createFromPrivateKey(bobPrivateKeyPublic, NetworkType.MIJIN_TEST);

const aliceAddressPublic = Address.createFromRawAddress('SBWEUWON6IBHCW5IC4EI6V6SMTVJGCJWGLF57UGK');
const bobAddressPublic = Address.createFromRawAddress('SB2Y5ND4FDLBIO5KHXTKRWODDG2QHIN73DTYT2PC');


// ***************************************************
// BisonではSecretLockのtypeが変わったので
// ムリヤリそこだけ変えて送ってみるテスト
// ***************************************************

// Alice picks a random number and hashes it.
// const random = crypto.randomBytes(10);
// const secret = sha3_512.create().update(random).hex().toUpperCase();
// const proof = random.toString('hex').toUpperCase();

const proof = "24F804FF5268C59D4050";
const secret = "F959EA8DAF15012F543EE557B3BF3A7DFD5E3CB41F3BEEB624C8F9379BA1B1A9AC3EAD91F6495DEC680173663BE6A87ED95EA888E2D41BEF4C2E2430785C7C5D";

// console.log('x    (proof)     : ' + proof);
// console.log('H(x) (secret)    : ' + secret);

const tx1 = SecretProofTransaction.create(
    Deadline.create(),
    HashType.SHA3_512,
    secret,
    proof,
    NetworkType.MIJIN_TEST
);

const tx1Signed = aliceAccountPublic.sign(tx1);

// console.log('tx1Signed.hash   : ' + tx1Signed.hash);
// console.log('tx1Signed.signer : ' + tx1Signed.signer);
console.log(`tx1Signed.payload: ${tx1Signed.payload}`);

const secretProofTxPayload = 
    tx1Signed.payload.substr(0,(4+64+32+2)*2) +      // size + sign + pubkey + version
    "5242" +
    tx1Signed.payload.substr(((4+64+32+2+2)*2));
    
// console.log(`hashLockTxPayload: ${secretLockTxPayload}`);

const secretProofTxPayloadSigningBytes = secretProofTxPayload.substr(100*2);
const keypair = nem2lib.KeyPair.createKeyPairFromPrivateKeyString(alicePrivateKeyPublic);
const signatureByte = nem2lib.KeyPair.sign(keypair, secretProofTxPayloadSigningBytes);
const signature = nem2lib.convert.uint8ToHex(signatureByte);

// console.log('publicKey: ' + nem2lib.convert.uint8ToHex(keypair.publicKey));
// console.log('signature: ' + nem2lib.convert.uint8ToHex(signatureByte));

const signedSecretProofTxPayload =
    secretProofTxPayload.substr(0,4*2) +
    signature +
    secretProofTxPayload.substr((4+64)*2);

console.log(`signedSecretProofTxPayload: ${signedSecretProofTxPayload}`);

const hashInputPayload = 
    signedSecretProofTxPayload.substr(4*2,32*2) +
    signedSecretProofTxPayload.substr((4+64)*2,32*2) +
    signedSecretProofTxPayload.substr((4+64+32)*2);
const signedSecretProofTxHash = sha3_256.create().update(Buffer.from(hashInputPayload, 'hex')).hex().toUpperCase();
console.log(`signedSecretProofTxHash: ${signedSecretProofTxHash}`);