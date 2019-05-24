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

const tx = TransferTransaction.create(
  Deadline.create(),
  recipientAddress,
  [NetworkCurrencyMosaic.createRelative(0)],
  PlainMessage.create(''),
  NetworkType.MIJIN_TEST,
  UInt64.fromUint(0)
)


const account = Account.createFromPrivateKey(process.env.PRIVATE_KEY, NetworkType.MIJIN_TEST);

const signedTransaction = account.sign(tx);

console.log(signedTransaction.payload)