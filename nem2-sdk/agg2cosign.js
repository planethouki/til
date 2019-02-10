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
    const signedTransaction = account.signCosignatureTransaction(cosignatureTransaction);
    console.log('cosignatureTransaction.parentHash : ' + signedTransaction.parentHash);
    console.log('cosignatureTransaction.signer     : ' + signedTransaction.signer);
    return signedTransaction;
};

// Replace with private key
const privateKey = 'B332E3CA7B31D0BC663232B66D7C282BC2FE1DC0C01BB0159586A2CBEADD6B2A';

const account = Account.createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST);
const accountHttp = new AccountHttp('http://192.168.11.77:3000');
const transactionHttp = new TransactionHttp('http://192.168.11.77:3000');

accountHttp.aggregateBondedTransactions(account.publicAccount)
    .flatMap((_) => _)
    .filter((_) => !_.signedByAccount(account.publicAccount))
    .map(transaction => cosignAggregateBondedTransaction(transaction, account))
    .flatMap(cosignatureSignedTransaction => transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction))
    .subscribe(announcedTransaction => console.log(announcedTransaction),
        err => console.error(err));
