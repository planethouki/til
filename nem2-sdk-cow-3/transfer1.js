const nem2Sdk = require("nem2-sdk");
const config = require("./config");

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


const privateKey = config.privateKey;
const account = Account.createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST);

const recipientAccount = Account.generateNewAccount(NetworkType.MIJIN_TEST);
const recipientAddress = recipientAccount.address;

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    recipientAddress,
    [new Mosaic(new MosaicId(config.mosaicDTO), UInt64.fromUint(10000000))],
    PlainMessage.create(''),
    NetworkType.MIJIN_TEST,
);

const signedTransaction = account.sign(transferTransaction);

const transactionHttp = new TransactionHttp(config.endpoint);
transactionHttp.announce(signedTransaction).subscribe(x => console.log(x),
    err => console.error(err));