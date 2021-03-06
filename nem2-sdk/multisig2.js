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
    HashType = nem2Sdk.HashType,
    ModifyMultisigAccountTransaction = nem2Sdk.ModifyMultisigAccountTransaction,
    MultisigCosignatoryModificationType = nem2Sdk.MultisigCosignatoryModificationType,
    MultisigCosignatoryModification = nem2Sdk.MultisigCosignatoryModification;

const sha3_512 = jssha3.sha3_512;


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


// ***************************************************
//             Sending Multisig Account
// ***************************************************

// Alice PrivateKey
const cosignatoryPrivateKey = '7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4';

// Multisig PublicKey
const multisigAccountPublicKey = '4CA83B9053C907AC7D9A5A0C26895489C8D07ADC57EF9AF1B8045775E0C91D31';

// Carol Receive
const recipientAddress = 'SBDG7U6NY7MTNOXKVK2JFZDLK2KSCRFPXDZ7IC3Q';

const multisigAccount = PublicAccount.createFromPublicKey(multisigAccountPublicKey, NetworkType.MIJIN_TEST);

const cosignatoryAccount = Account.createFromPrivateKey(cosignatoryPrivateKey, NetworkType.MIJIN_TEST);

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    Address.createFromRawAddress(recipientAddress),
    [XEM.createRelative(1)],
    PlainMessage.create('sending 1 nem:xem'),
    NetworkType.MIJIN_TEST
);

const aggregateTransaction = AggregateTransaction.createBonded(
    Deadline.create(),
    [
        transferTransaction.toAggregate(multisigAccount),
    ],
    NetworkType.MIJIN_TEST
);

//Signing the aggregate transaction
const signedTransaction = cosignatoryAccount.sign(aggregateTransaction);

console.log('signedTransaction.hash   : ' + signedTransaction.hash);
console.log('signedTransaction.signer : ' + signedTransaction.signer);

//Creating the lock funds transaction and announce it

const lockFundsTransaction = LockFundsTransaction.create(
    Deadline.create(),
    XEM.createRelative(10),
    UInt64.fromUint(480),
    signedTransaction,
    NetworkType.MIJIN_TEST);

const lockFundsTransactionSigned = cosignatoryAccount.sign(lockFundsTransaction);

console.log('lockFundsTransactionSigned.hash   : ' + lockFundsTransactionSigned.hash);
console.log('lockFundsTransactionSigned.signer : ' + lockFundsTransactionSigned.signer);

const transactionHttp = new TransactionHttp('http://192.168.11.77:3000');

transactionHttp.announce(lockFundsTransactionSigned).subscribe(x => console.log(x),
err => console.error(err));

setTimeout(() => transactionHttp.announceAggregateBonded(signedTransaction).subscribe(x => console.log(x),
err => console.error(err)), 30000);



