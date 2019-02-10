const nem2lib = require("nem2-library");
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
    HashType = nem2Sdk.HashType
    ModifyMultisigAccountTransaction = nem2Sdk.ModifyMultisigAccountTransaction,
    MultisigCosignatoryModificationType = nem2Sdk.MultisigCosignatoryModificationType,
    MultisigCosignatoryModification = nem2Sdk.MultisigCosignatoryModification,
    RegisterNamespaceTransaction = nem2Sdk.RegisterNamespaceTransaction,
    MosaicDefinitionTransaction = nem2Sdk.MosaicDefinitionTransaction,
    MosaicSupplyChangeTransaction = nem2Sdk.MosaicSupplyChangeTransaction,
    MosaicProperties = nem2Sdk.MosaicProperties,
    MosaicSupplyType = nem2Sdk.MosaicSupplyType;

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
Multisig:
  private: E0BC90AA55A8D78A1DC8CE203A95C31A62E1EAF43D7BF94379709B79D90E0545
  public: 4CA83B9053C907AC7D9A5A0C26895489C8D07ADC57EF9AF1B8045775E0C91D31
  address: SBHAN5NVIMDZBYTYPBIHCZ5I5EZZO2WSGJ6PGKFI
*/

const signAndDisplay = (signData, privateKey)  => {
    const keypair = nem2lib.KeyPair.createKeyPairFromPrivateKeyString(privateKey);
    const signature = nem2lib.KeyPair.sign(keypair, signData);
    console.log('signature: ' + nem2lib.convert.uint8ToHex(signature));
};

const payloadDisplay = (signedTransaction) => {
    console.log('payload  : ' + signedTransaction.payload.substring(8,136));
    // console.log('payload  : ' + signedTransaction.payload);
    console.log('hash     : ' + signedTransaction.hash);
};


const alicePrivateKey = '7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4';
const aliceAccount = Account.createFromPrivateKey(alicePrivateKey,NetworkType.MIJIN_TEST);
const bobPrivateKey = '31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E';
const bobAccount = Account.createFromPrivateKey(bobPrivateKey,NetworkType.MIJIN_TEST);


// Alice to Bob
const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    bobAccount.address,
    [new Mosaic(new MosaicId('nem:xem'), UInt64.fromUint(10000000))],
    PlainMessage.create(''),
    NetworkType.MIJIN_TEST,
);
// const signedTransferTransaction = aliceAccount.sign(transferTransaction);
// console.log('Transfer Transaction');
// signAndDisplay(signedTransferTransaction.payload.substring(200), alicePrivateKey);
// payloadDisplay(signedTransferTransaction);


// Bob to Alice
const transferTransaction3 = TransferTransaction.create(
    Deadline.create(),
    aliceAccount.address,
    [new Mosaic(new MosaicId('nem:xem'), UInt64.fromUint(10000000))],
    PlainMessage.create(''),
    NetworkType.MIJIN_TEST,
);

const aggregateBondedTransaction = AggregateTransaction.createBonded(
    Deadline.create(),
    [
        transferTransaction.toAggregate(aliceAccount.publicAccount),        // Alice to Bob
        transferTransaction3.toAggregate(bobAccount.publicAccount),         // Bob to Alice
    ],
    NetworkType.MIJIN_TEST
);
const sinedAggregateBondedTransaction = aliceAccount.sign(aggregateBondedTransaction);
console.log('Aggregate Bonded Transaction');
signAndDisplay(sinedAggregateBondedTransaction.payload.substring(200), alicePrivateKey);
payloadDisplay(sinedAggregateBondedTransaction);


// ***************************************************
//             LockFunds Transaction
// ***************************************************
const lockFundsTransaction = LockFundsTransaction.create(
    Deadline.create(),
    new Mosaic( new MosaicId('nem:xem'), UInt64.fromUint(10000000)),
    UInt64.fromUint(480),
    sinedAggregateBondedTransaction,
    NetworkType.MIJIN_TEST
);
const signedLockFundsTransaction = aliceAccount.sign(lockFundsTransaction);
console.log('LockFunds Transaction');
signAndDisplay(signedLockFundsTransaction.payload.substring(200), alicePrivateKey);
payloadDisplay(signedLockFundsTransaction);


// ***************************************************
//             announce
// ***************************************************
const accountHttp = new AccountHttp('http://192.168.11.77:3000');
const transactionHttp = new TransactionHttp('http://192.168.11.77:3000');

setTimeout(() => {
    transactionHttp.announce(signedLockFundsTransaction).subscribe(
        x => console.log(x),
        err => console.error(err)
    )}
, 0);


setTimeout(() => {
    transactionHttp.announceAggregateBonded(sinedAggregateBondedTransaction).subscribe(
        x => console.log(x),
        err => console.error(err)
    )}
, 20000);



// ***************************************************
//             Cosignature Transaction
// ***************************************************
console.log('Cosignature Transaction');
signAndDisplay(sinedAggregateBondedTransaction.hash, bobPrivateKey);

const cosignAggregateBondedTransaction = (transaction, account)  => {
    const cosignatureTransaction = CosignatureTransaction.create(transaction);
    const signedTransaction = account.signCosignatureTransaction(cosignatureTransaction);
    console.log('cosignatureTransaction.parentHash : ' + signedTransaction.parentHash);
    console.log('cosignatureTransaction.signer     : ' + signedTransaction.signer);
    console.log('cosignatureTransaction.signature  : ' + signedTransaction.signature);
    return signedTransaction;
};

setTimeout(() => {
    accountHttp.aggregateBondedTransactions(bobAccount.publicAccount)
    .flatMap((_) => _)
    .filter((_) => !_.signedByAccount(bobAccount.publicAccount))
    .map(transaction => cosignAggregateBondedTransaction(transaction, bobAccount))
    .flatMap(cosignatureSignedTransaction => transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction))
    .subscribe(announcedTransaction => console.log(announcedTransaction),
        err => console.error(err));
    }
, 40000);
