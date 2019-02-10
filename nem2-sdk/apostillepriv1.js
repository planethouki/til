const nem2Sdk = require("nem2-sdk");
const cryptoJS = require("crypto-js");
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
    HashType = nem2Sdk.HashType,
    ModifyMultisigAccountTransaction = nem2Sdk.ModifyMultisigAccountTransaction,
    MultisigCosignatoryModificationType = nem2Sdk.MultisigCosignatoryModificationType,
    MultisigCosignatoryModification = nem2Sdk.MultisigCosignatoryModification;

const sha3_512 = jssha3.sha3_512;


/*
sender:
  private: 7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4
  public: 5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C
  address: SBWEUWON6IBHCW5IC4EI6V6SMTVJGCJWGLF57UGK
sink:
  address: SDICZ5EAOD5W6YCAJL33OS5B4Y6FUOWOUOOLCZAL
*/


const text = '999988887777';
const title = '4433221100.txt';
const tags = ['eeeeeeee'];

const apostilleHashPrefix = 'fe4e545983';

const ownerPrivateKey = '7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4';
const ownerAccount = Account.createFromPrivateKey(ownerPrivateKey,NetworkType.MIJIN_TEST);
const ownerKeypair = nem2lib.KeyPair.createKeyPairFromPrivateKeyString(ownerPrivateKey);

const contentHash = cryptoJS.SHA256(text);
const contentHashSig = nem2lib.KeyPair.sign(ownerKeypair, contentHash.toString(cryptoJS.enc.Hex));
const apostilleHash = apostilleHashPrefix + nem2lib.convert.uint8ToHex(contentHashSig).toLowerCase();

const filenameHash = cryptoJS.SHA256(title);
const filenameHashSig = nem2lib.KeyPair.sign(ownerKeypair, filenameHash.toString(cryptoJS.enc.Hex));
const dedicatedPrivateKey = nem2lib.convert.uint8ToHex(filenameHashSig.slice(0, 32));

const dedicatedAccount = Account.createFromPrivateKey(dedicatedPrivateKey,NetworkType.MIJIN_TEST);

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    dedicatedAccount.address,
    [XEM.createRelative(0)],
    PlainMessage.create(apostilleHash),
    NetworkType.MIJIN_TEST,
);
transferTransaction.fee = UInt64.fromUint(150000);
const signedTransaction = ownerAccount.sign(transferTransaction);

const transactionHttp = new TransactionHttp('http://192.168.11.77:3000');

transactionHttp.announce(signedTransaction).subscribe(x => console.log(x),
    err => console.error(err));

console.log('hash:    ' + signedTransaction.hash);
console.log('signer:  ' + signedTransaction.signer);
console.log('payload: ' + signedTransaction.payload);

const date = new Date();

const nty = { "data": [
    {
        "filename": title,
        "tags": tags.join(' '),
        "fileHash": apostilleHash,
        "owner": ownerAccount.address.address,
        "fromMultisig": ownerAccount.address.address,
        "dedicatedAccount": dedicatedAccount.address.address,
        "dedicatedPrivateKey": dedicatedAccount.privateKey.toLowerCase(),
        "txHash": signedTransaction.hash.toLowerCase(),
        "txMultisigHash": "",
        "timeStamp": date.toUTCString()
    }
]};


const apostilleFilename = title.slice(0, title.lastIndexOf('.')).concat(
    ' -- Apostille TX ',
    signedTransaction.hash.toLowerCase(),
    ' -- Date ',
    date.getFullYear(),
    '-',
    ("00" + (date.getMonth() + 1)).slice(-2),
    '-',
    ("00" + (date.getDate())).slice(-2),
    title.slice(title.lastIndexOf('.'))
);

console.log(apostilleFilename);

console.log(JSON.stringify(nty));