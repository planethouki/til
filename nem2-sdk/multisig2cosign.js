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
    AccountHttp = nem2Sdk.AccountHttp,
    QueryParams = nem2Sdk.QueryParams;

/* 3000 network (Public)
Alice:
  private: 7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4
  public: 5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C
  address: SBWEUWON6IBHCW5IC4EI6V6SMTVJGCJWGLF57UGK
Bob:
  private: 31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E
  public: 3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57
  address: SB2Y5ND4FDLBIO5KHXTKRWODDG2QHIN73DTYT2PC
carol:
  private: B332E3CA7B31D0BC663232B66D7C282BC2FE1DC0C01BB0159586A2CBEADD6B2A
  public: 543BB01DFEEA0D9A25ADDE515DACC72F2125A8AAE85EDD682D77251E2C4EC174
  address: SBDG7U6NY7MTNOXKVK2JFZDLK2KSCRFPXDZ7IC3Q
Multisig:
  private: E0BC90AA55A8D78A1DC8CE203A95C31A62E1EAF43D7BF94379709B79D90E0545
  public: 4CA83B9053C907AC7D9A5A0C26895489C8D07ADC57EF9AF1B8045775E0C91D31
  address: SBHAN5NVIMDZBYTYPBIHCZ5I5EZZO2WSGJ6PGKFI
*/

const cosignAggregateBondedTransaction = (transaction, account)  => {
    const cosignatureTransaction = CosignatureTransaction.create(transaction);
    const signedTransaction = account.signCosignatureTransaction(cosignatureTransaction);
    console.log('cosignatureTransaction.parentHash : ' + signedTransaction.parentHash);
    console.log('cosignatureTransaction.signer     : ' + signedTransaction.signer);
    return signedTransaction;
};

// Replace with private key
const privateKey = '31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E';

const account = Account.createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST);
const accountHttp = new AccountHttp('http://192.168.11.77:3000');
const transactionHttp = new TransactionHttp('http://192.168.11.77:3000');

// transactionHttp.getTransaction("B0891EF78E80ACD7915B6D5B50D0321F3338D00F624817AF42CFE763699BCBF0")
// .subscribe(tx => console.log(tx), err => console.log(err));

const monPublicKey = '4CA83B9053C907AC7D9A5A0C26895489C8D07ADC57EF9AF1B8045775E0C91D31';
const monPublicAccount = PublicAccount.createFromPublicKey(monPublicKey, NetworkType.MIJIN_TEST);

accountHttp.aggregateBondedTransactions(monPublicAccount)
.flatMap((_) => _)
.filter((_) => !_.signedByAccount(account.publicAccount))
.map(transaction => cosignAggregateBondedTransaction(transaction, account))
.flatMap(cosignatureSignedTransaction => transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction))
.subscribe(announcedTransaction => console.log(announcedTransaction),
    err => console.error(err));
    

// accountHttp.aggregateBondedTransactions(account.publicAccount)
// .flatMap((_) => _)
// .filter((_) => !_.signedByAccount(account.publicAccount))
// .map(transaction => cosignAggregateBondedTransaction(transaction, account))
// .flatMap(cosignatureSignedTransaction => transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction))
// .subscribe(announcedTransaction => console.log(announcedTransaction),
//     err => console.error(err));
    

// accountHttp.getMultisigAccountInfo(Address.createFromRawAddress('SBHAN5NVIMDZBYTYPBIHCZ5I5EZZO2WSGJ6PGKFI')).subscribe(
//   accountInfo => console.log(accountInfo),
//   err => console.error(err)
// );


// accountHttp.aggregateBondedTransactions(monPublicAccount)
// .subscribe(tx => console.log(tx), err => console.log(err));