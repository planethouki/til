const nem2Sdk = require("nem2-sdk");
const config = require("./config");
const helper = require("./helper");

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
    MosaicDefinitionTransaction = nem2Sdk.MosaicDefinitionTransaction,
    MosaicSupplyChangeTransaction = nem2Sdk.MosaicSupplyChangeTransaction,
    MosaicProperties = nem2Sdk.MosaicProperties,
    MosaicSupplyType = nem2Sdk.MosaicSupplyType;

const toLE = helper.toLE,
    calcurateHash = helper.calcurateHash,
    hexToUint8 = helper.hexToUint8;


const privateKey = config.privateKey;
const account = Account.createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST);

const hexNonce = "00000002"

const id = calcurateHash(toLE(hexNonce) + account.publicKey)
const mosaicId = [
    Number("0x" + toLE(id.substring(0,8))),
    Number("0x" + toLE(id.substring(8,16))) & 0x7FFFFFFF
]
console.log(mosaicId)
const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
    Deadline.create(),
    hexToUint8(toLE(hexNonce)),
    new UInt64(mosaicId),
    MosaicProperties.create({
        supplyMutable: true,
        transferable: true,
        levyMutable: false,
        divisibility: 0,
        duration: UInt64.fromUint(1000),
    }),
    NetworkType.MIJIN_TEST,
);

const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
    Deadline.create(),
    mosaicDefinitionTransaction.mosaicId,
    MosaicSupplyType.Increase,
    UInt64.fromUint(1000000),
    NetworkType.MIJIN_TEST,
);

const aggregateTransaction = AggregateTransaction.createComplete(
    Deadline.create(),
    [
        mosaicDefinitionTransaction.toAggregate(account.publicAccount),
        mosaicSupplyChangeTransaction.toAggregate(account.publicAccount),
    ],
    NetworkType.MIJIN_TEST,
    []
);

const signedTransaction = account.sign(aggregateTransaction);

console.log(signedTransaction.hash);

const transactionHttp = new TransactionHttp(config.endpoint);
transactionHttp.announce(signedTransaction).subscribe(x => console.log(x),
    err => console.error(err));