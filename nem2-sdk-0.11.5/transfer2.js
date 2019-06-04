process.env.PRIVATE_KEY = '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E';
process.env.NODE_URL = 'http://3.112.207.254:3000'

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

const recipientAddress = Address.createFromRawAddress('SD5DT3-CH4BLA-BL5HIM-EKP2TA-PUKF4N-Y3L5HR-IR54');

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

// const transactionHttp = new TransactionHttp(process.env.NODE_URL);
// transactionHttp.announce(signedTransaction).subscribe(
//   x => console.log(x),
//   err => console.error(err)
// );

// console.log('hash:    ' + signedTransaction.hash);
// console.log('signer:  ' + signedTransaction.signer);
// console.log('payload: ' + signedTransaction.payload);

// 863A9675321280E4366CD2702F5F9F549C0EE68E4BA5A23C65B7946DA150640D
// 13c4e24f7b2f1a4c36e8cb88d36aa2a7d0da460ebd59225936457460ed9ae9ec

const nemesisGenerationHash = '5ABBD9F7894EE7E5D4C3CDA934245396AEFCD1CB0426F265AC81F4F3450AB6DD'

// hash:    9B63108BBE8B421D308F72ED8B2776D23BA4382A614CE7D72137AB294CC51F76
// signer:  AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26
// payload: A50000009140123A4932B66072A6AAC636548B2C8BF8204EA90FE7C74A80798CDF8A3754DE16DA018CB9B42D239DFD573BC2B125E9BDA84D3B18600FABE5C1F85DE91207AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE260390544100000000000000001D7E4A441700000090FA39EC47E05600AFA74308A7EA607D145E371B5F4F1447BC0100010044B262C46CEABB850000000000000000

const privateKey = process.env.PRIVATE_KEY;

// const txPayload = 
//   'A5000000'
//   + '9140123A4932B66072A6AAC636548B2C8BF8204EA90FE7C74A80798CDF8A3754DE16DA018CB9B42D239DFD573BC2B125E9BDA84D3B18600FABE5C1F85DE91207'
//   + 'AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26'
//   + '0390'
//   + '5441'
//   + '0000000000000000'
//   + '1D7E4A4417000000'
//   + '90FA39EC47E05600AFA74308A7EA607D145E371B5F4F1447BC'
//   + '0100'
//   + '0100'
//   + '44B262C46CEABB85'
//   + '0000000000000000'
const txPayload = signedTransaction.payload

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