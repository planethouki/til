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
//             Bob to Alice   (Private)
// ***************************************************
if (process.argv.length <= 2) {
    throw new Error("need secret (base64 string)");
}

const secret = Buffer.from(process.argv[2], "base64").toString('hex').toUpperCase();

// B creates TX2 SecretLockTransaction{ H(x), A, MosaicId, Amount, valid for 84h }
const tx2 = SecretLockTransaction.create(
    Deadline.create(),
    new Mosaic(new MosaicId('foo:bar'), UInt64.fromUint(1)),
    UInt64.fromUint(10), //officially 84h
    HashType.SHA3_512,
    secret,
    aliceAddressPrivate,
    NetworkType.MIJIN_TEST
);

// Bob sends TX2 to network (PRIVATE)
const tx2Signed = bobAccountPrivate.sign(tx2);

console.log('tx2Signed.hash   : ' + tx2Signed.hash);
console.log('tx2Signed.signer : ' + tx2Signed.signer);

// const transactionHttpPrivate = new TransactionHttp('http://192.168.11.77:3100');

transactionHttpPrivate.announce(tx2Signed).subscribe(
    x => console.log(x),
    err => console.error(err)
);    

