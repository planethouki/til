const nem2Sdk = require("nem2-sdk");
const crypto = require("crypto");
const jssha3 = require('js-sha3');

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

const urlPublic = 'http://192.168.11.77:3000';
const urlPrivate = 'http://192.168.11.77:3100';

const transactionHttpPublic = new TransactionHttp(urlPublic);
const transactionHttpPrivate = new TransactionHttp(urlPrivate);


// const alicePrivateKeyPrivate = '8CBA73B9DF31D85DCFA4B9E1D3B7A88E5A5F32C930FCC45FE5A457619F3E6687';
// const aliceAccountPrivate = Account.createFromPrivateKey(alicePrivateKeyPrivate, NetworkType.MIJIN_TEST);
// const alicePrivateKeyPublic = '7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4';
// const aliceAccountPublic = Account.createFromPrivateKey(alicePrivateKeyPublic, NetworkType.MIJIN_TEST);

const bobPrivateKeyPrivate = 'BA46F91D7BCD40B6482E138F0D3D53A29F0A6097B5C4586C6ABD81A3BA3A2DAD';
const bobAccountPrivate = Account.createFromPrivateKey(bobPrivateKeyPrivate, NetworkType.MIJIN_TEST);
const bobPrivateKeyPublic = '31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E';
const bobAccountPublic = Account.createFromPrivateKey(bobPrivateKeyPublic, NetworkType.MIJIN_TEST);

const aliceAddressPrivate = Address.createFromRawAddress('SBNRDTMZ3MF4RFNQA2ZA33G74EGTINCKX2EHYYHY');
const aliceAddressPublic = Address.createFromRawAddress('SBWEUWON6IBHCW5IC4EI6V6SMTVJGCJWGLF57UGK');
const bobAddressPrivate = Address.createFromRawAddress('SCBCMLVDJBXARCOI6XSKEU3ER2L6HH7UBEPTENGQ');
const bobAddressPublic = Address.createFromRawAddress('SB2Y5ND4FDLBIO5KHXTKRWODDG2QHIN73DTYT2PC');



// ***************************************************
//             Bob Unlock   (Public)
// ***************************************************
if (process.argv.length <= 2) {
    throw new Error("need proof (base64 string)");
}

const proof = Buffer.from(process.argv[2], "base64").toString('hex').toUpperCase();
//const proof = process.argv[2];
const hash = sha3_512.create();
const secret = hash.update(Buffer.from(proof, 'hex')).hex().toUpperCase();

// Bob spends TX1 transaction by sending SecretProofTransaction (in PUBLIC network)
// const bobPrivateKeyPublic = '31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E';
// const bobAccountPublic = Account.createFromPrivateKey(bobPrivateKeyPublic, NetworkType.MIJIN_TEST);
const tx4 = SecretProofTransaction.create(
    Deadline.create(),
    HashType.SHA3_512,
    secret,
    proof,
    NetworkType.MIJIN_TEST
);

const tx4Signed = bobAccountPublic.sign(tx4);

console.log('tx4Signed.hash   : ' + tx4Signed.hash);
console.log('tx4Signed.signer : ' + tx4Signed.signer);


transactionHttpPublic.announce(tx4Signed).subscribe(
    x => console.log(x),
    err => console.error(err)
);


