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


/* 
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
  private: BF40EF46134ED68C148760AAA6EB601F94D81452B74C02E0F8CF462842E4EEB6
  public: 3A0E4A9C6A76EEB44AD5691EE0B3642FB2874D7C368488077E4900F75709BF63
  address: SAJ4WN67SRZGYAZZMO4JP6SPX2QDU36IABT5NYJR
*/

const bobPrivateKey = '31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E';
const alicePublicKey = '5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C';

const bobAccount = Account.createFromPrivateKey(bobPrivateKey, NetworkType.MIJIN_TEST);
const alicePublicAccount = PublicAccount.createFromPublicKey(alicePublicKey, NetworkType.MIJIN_TEST);

const toBobXEM = 5;
const toAliceXEM = 5;
const secret = "F2EE3A1B32E75D3E983FAB2597A089CFD1699840D1094B9E29E0A3E26A11A4C45D5A6BD3D31ED5F6E17D012D435CDA6F3897B7A69614E8FC1A30235C3B5BBC16";

// Multisig PublicKey
const multisigAccountPublicKey = '3A0E4A9C6A76EEB44AD5691EE0B3642FB2874D7C368488077E4900F75709BF63';
const multisigAccount = PublicAccount.createFromPublicKey(multisigAccountPublicKey, NetworkType.MIJIN_TEST);

const tx1a = TransferTransaction.create(
    Deadline.create(),
    bobAccount.address,
    [new Mosaic(new MosaicId('nem:xem'), UInt64.fromUint(toBobXEM * 1000000))],
    PlainMessage.create(''),
    NetworkType.MIJIN_TEST
);
const tx1aIn = tx1a.toAggregate(multisigAccount);

const tx1b = TransferTransaction.create(
    Deadline.create(),
    alicePublicAccount.address,
    [new Mosaic(new MosaicId('nem:xem'), UInt64.fromUint(toAliceXEM * 1000000))],
    PlainMessage.create(''),
    NetworkType.MIJIN_TEST
);
const tx1bIn = tx1b.toAggregate(multisigAccount);

const tx1bl = SecretLockTransaction.create(
    Deadline.create(),
    new Mosaic(new MosaicId('nem:xem'), UInt64.fromUint(toAliceXEM * 1000000)),
    UInt64.fromUint(60), //officially 96h
    HashType.SHA3_512,
    secret,
    bobAccount.address,
    NetworkType.MIJIN_TEST
);
const tx1blIn = tx1bl.toAggregate(alicePublicAccount);


const aggregateTransaction = AggregateTransaction.createBonded(
    Deadline.create(),
    [
        tx1aIn,
        tx1bIn,
        tx1blIn,
    ],
    NetworkType.MIJIN_TEST
);

const signedTransaction = bobAccount.sign(aggregateTransaction);

// Creating the lock funds transaction
const lockFundsTransaction = LockFundsTransaction.create(
    Deadline.create(),
    XEM.createRelative(10),
    UInt64.fromUint(480),
    signedTransaction,
    NetworkType.MIJIN_TEST);

const lockFundsTransactionSigned = bobAccount.sign(lockFundsTransaction);




// const transactionHttp = new TransactionHttp('http://192.168.11.77:3000');

// transactionHttp
//     .announce(lockFundsTransactionSigned)
//     .subscribe(x => console.log(x), err => console.error(err));

// setTimeout(() => 
//     transactionHttp
//         .announceAggregateBonded(signedTransaction)
//         .subscribe(x => console.log(x), err => console.error(err))
// ,30000);


console.log('lockFundsTransactionSigned.hash   : ' + lockFundsTransactionSigned.hash);
console.log('lockFundsTransactionSigned.signer : ' + lockFundsTransactionSigned.signer);
console.log('lockFundsTransactionSigned.payload: ' + lockFundsTransactionSigned.payload);
console.log('aggregateTransactionSigned.hash   : ' + signedTransaction.hash);
console.log('aggregateTransactionSigned.signer : ' + signedTransaction.signer);
console.log('aggregateTransactionSigned.payload: ' + signedTransaction.payload);
