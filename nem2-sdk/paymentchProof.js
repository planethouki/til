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

const url = 'http://192.168.11.77:3000';

const transactionHttp = new TransactionHttp(url);


const alicePrivateKey = '7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4';
const aliceAccount = Account.createFromPrivateKey(alicePrivateKey, NetworkType.MIJIN_TEST);

const bobPrivateKey = '31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E';
const bobAccount = Account.createFromPrivateKey(bobPrivateKey, NetworkType.MIJIN_TEST);


const proof = '';
const account = aliceAccount;


const hash = sha3_512.create();
const secret = hash.update(Buffer.from(proof, 'hex')).hex().toUpperCase();

const secretProofTransaction = SecretProofTransaction.create(
    Deadline.create(),
    HashType.SHA3_512,
    secret,
    proof,
    NetworkType.MIJIN_TEST
);

const signedTransaction = account.sign(secretProofTransaction);

console.log('secretProofTransaction.hash   : ' + signedTransaction.hash);
console.log('secretProofTransaction.signer : ' + signedTransaction.signer);

transactionHttp.announce(signedTransaction).subscribe(
    x => console.log(x),
    err => console.error(err)
);