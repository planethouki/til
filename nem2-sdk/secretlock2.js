const nem2Sdk = require("nem2-sdk");
const crypto = require("crypto");
const jssha3 = require('js-sha3');
const nem2lib = require("nem2-library");
const SHA256 = require("crypto-js/sha256");

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

const urlPublic = 'http://yonsen.japanwest.cloudapp.azure.com:3000';

const transactionHttpPublic = new TransactionHttp(urlPublic);


// const alicePrivateKeyPrivate = '8CBA73B9DF31D85DCFA4B9E1D3B7A88E5A5F32C930FCC45FE5A457619F3E6687';
// const aliceAccountPrivate = Account.createFromPrivateKey(alicePrivateKeyPrivate, NetworkType.MIJIN_TEST);
const alicePrivateKeyPublic = '7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4';
const aliceAccountPublic = Account.createFromPrivateKey(alicePrivateKeyPublic, NetworkType.MIJIN_TEST);

// const bobPrivateKeyPrivate = 'BA46F91D7BCD40B6482E138F0D3D53A29F0A6097B5C4586C6ABD81A3BA3A2DAD';
// const bobAccountPrivate = Account.createFromPrivateKey(bobPrivateKeyPrivate, NetworkType.MIJIN_TEST);
const bobPrivateKeyPublic = '31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E';
const bobAccountPublic = Account.createFromPrivateKey(bobPrivateKeyPublic, NetworkType.MIJIN_TEST);

// const aliceAddressPrivate = Address.createFromRawAddress('SBNRDTMZ3MF4RFNQA2ZA33G74EGTINCKX2EHYYHY');
const aliceAddressPublic = Address.createFromRawAddress('SBWEUWON6IBHCW5IC4EI6V6SMTVJGCJWGLF57UGK');
// const bobAddressPrivate = Address.createFromRawAddress('SCBCMLVDJBXARCOI6XSKEU3ER2L6HH7UBEPTENGQ');
const bobAddressPublic = Address.createFromRawAddress('SB2Y5ND4FDLBIO5KHXTKRWODDG2QHIN73DTYT2PC');


// ***************************************************
//             Secret Lock Tx
// ***************************************************

// Alice picks a random number and hashes it.
const random = crypto.randomBytes(10);
const secret512 = sha3_512.create().update(random).hex().toUpperCase();
const proof = random.toString('hex');
const secret256 = sha3_256.create().update(random).hex().toUpperCase();

console.log('x    (proof)     : ' + proof);
console.log('H512(x) (secret) : ' + secret512);
console.log('H256(x) (secret) : ' + secret256);

const tx1 = SecretLockTransaction.create(
    Deadline.create(),
    XEM.createRelative(1),
    UInt64.fromUint(60), //officially 96h
    HashType.SHA3_512,
    secret512,
    bobAddressPublic, // send to bob public
    NetworkType.MIJIN_TEST
);

// Alice sends TX1 to network (PUBLIC)
const tx1Signed = aliceAccountPublic.sign(tx1);

// console.log('tx1Signed.hash   : ' + tx1Signed.hash);
// console.log('tx1Signed.signer : ' + tx1Signed.signer);
console.log(`tx1Signed.payload: ${tx1Signed.payload}`);
// console.log("---");
// console.log(`tx1Signed.payload: ${tx1Signed.payload.substr(0,(234-90)*2)}`);
// console.log(`tx1Signed.payload: ${tx1Signed.payload.substr((4*2),(234-90-4)*2)}`);

// transactionHttpPublic.announce(tx1Signed).subscribe(
//     x => console.log(x),
//     err => console.error(err)
// );



const secretLockTxPayload = 
    "CA000000" +
    tx1Signed.payload.substr(4*2,(64+32+2)*2) +
    "4152" +
    tx1Signed.payload.substr((4+64+32+2+2)*2,(8+8+8+8+8)*2) +
    "03" +
    secret256 + 
    tx1Signed.payload.substr(-(25*2));
    
console.log(`secretLockTxPayload: ${secretLockTxPayload}`);

const secretLockTxPayloadSigningBytes = secretLockTxPayload.substr(100*2);
const keypair = nem2lib.KeyPair.createKeyPairFromPrivateKeyString(alicePrivateKeyPublic);
const signatureByte = nem2lib.KeyPair.sign(keypair, secretLockTxPayloadSigningBytes);
const signature = nem2lib.convert.uint8ToHex(signatureByte);

// console.log('publicKey: ' + nem2lib.convert.uint8ToHex(keypair.publicKey));
// console.log('signature: ' + nem2lib.convert.uint8ToHex(signatureByte));

const signedSecretLockTxPayload =
    secretLockTxPayload.substr(0,4*2) +
    signature +
    secretLockTxPayload.substr((4+64)*2);

console.log(`signedHashLockTxPayload: ${signedSecretLockTxPayload}`);

const hashInputPayload = 
    signedSecretLockTxPayload.substr(4*2,32*2) +
    signedSecretLockTxPayload.substr((4+64)*2,32*2) +
    signedSecretLockTxPayload.substr((4+64+32)*2);
const signedSecretLockTxHash = sha3_256.create().update(Buffer.from(hashInputPayload, 'hex')).hex().toUpperCase();
console.log(`signedSecretLockTxHash: ${signedSecretLockTxHash}`);