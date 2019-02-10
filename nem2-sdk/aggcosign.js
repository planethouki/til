const nem2Sdk = require("nem2-sdk");

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
    XEM = nem2Sdk.XEM,
    AggregateTransaction = nem2Sdk.AggregateTransaction,
    PublicAccount = nem2Sdk.PublicAccount,
    LockFundsTransaction = nem2Sdk.LockFundsTransaction,
    Listener = nem2Sdk.Listener,
    CosignatureTransaction = nem2Sdk.CosignatureTransaction,
    AccountHttp = nem2Sdk.AccountHttp;


const cosignAggregateBondedTransaction = (transaction, account)  => {
    const cosignatureTransaction = CosignatureTransaction.create(transaction);
    return account.signCosignatureTransaction(cosignatureTransaction);
};

// Replace with private key
// const privateKey = 'BA46F91D7BCD40B6482E138F0D3D53A29F0A6097B5C4586C6ABD81A3BA3A2DAD';
const privateKey = '8CBA73B9DF31D85DCFA4B9E1D3B7A88E5A5F32C930FCC45FE5A457619F3E6687';

const account = Account.createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST);

const url = "http://catapult-test.44uk.net:3000";
// const url = 'http://192.168.11.77:3000'

const accountHttp = new AccountHttp(url);
const transactionHttp = new TransactionHttp(url);

accountHttp.aggregateBondedTransactions(account.publicAccount)
    .flatMap((_) => _)
    .filter((_) => !_.signedByAccount(account.publicAccount))
    .map(transaction => cosignAggregateBondedTransaction(transaction, account))
    .flatMap(cosignatureSignedTransaction => transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction))
    .subscribe(announcedTransaction => console.log(announcedTransaction),
        err => console.error(err));
