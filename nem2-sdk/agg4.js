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
    Listener = nem2Sdk.Listener;


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
*/

const alicePrivateKey = '7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4';
const bobPrivateKey = '31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E';

const aliceAccount = Account.createFromPrivateKey(alicePrivateKey, NetworkType.MIJIN_TEST);
const bobAccount = Account.createFromPrivateKey(bobPrivateKey, NetworkType.MIJIN_TEST);

const aliceToBobTx = TransferTransaction.create(
    Deadline.create(),
    bobAccount.address,
    [new Mosaic( new MosaicId('nem:xem'), UInt64.fromUint(100000000))],
    PlainMessage.create('send 100 nem:xem to bob from alice'),
    NetworkType.MIJIN_TEST,
);

const bobToAliceTx = TransferTransaction.create(
    Deadline.create(),
    aliceAccount.address,
    [new Mosaic( new MosaicId('nem:xem'), UInt64.fromUint(100000000))],
    PlainMessage.create('send 100 nem:xem to alice from bob'),
    NetworkType.MIJIN_TEST,
);

const deadline = Deadline.create();

const aggregateCompleteTransaction = AggregateTransaction.createComplete(
    deadline,
    [
        aliceToBobTx.toAggregate(aliceAccount.publicAccount),
        bobToAliceTx.toAggregate(bobAccount.publicAccount),
    ],
    NetworkType.MIJIN_TEST,
    []
);

const aggregateBondedTransaction = AggregateTransaction.createBonded(
    deadline,
    [
        aliceToBobTx.toAggregate(aliceAccount.publicAccount),
        bobToAliceTx.toAggregate(bobAccount.publicAccount),
    ],
    NetworkType.MIJIN_TEST
);

const signedTransaction = aggregateCompleteTransaction.signTransactionWithCosignatories(aliceAccount, [bobAccount]);



// const lockFundsTransaction = LockFundsTransaction.create(
//     Deadline.create(),
//     new Mosaic( new MosaicId('nem:xem'), UInt64.fromUint(10000000)),
//     UInt64.fromUint(480),
//     signedTransaction,
//     NetworkType.MIJIN_TEST);

// const lockFundsTransactionSigned = carolAccount.sign(lockFundsTransaction);


const transactionHttp = new TransactionHttp('http://192.168.11.77:3000');

// transactionHttp
//     .announce(lockFundsTransactionSigned)
//     .subscribe(x => console.log(x), err => console.error(err));

// setTimeout(() => 
//     transactionHttp
//         .announceAggregateBonded(signedTransaction)
//         .subscribe(x => console.log(x), err => console.error(err))
// ,30000);


transactionHttp
    .announce(signedTransaction)
    .subscribe(x => console.log(x), err => console.error(err))

// console.log('lockFundsTransactionSigned.hash   : ' + lockFundsTransactionSigned.hash);
// console.log('lockFundsTransactionSigned.signer : ' + lockFundsTransactionSigned.signer);
// console.log('lockFundsTransactionSigned.payload: ' + lockFundsTransactionSigned.payload);

console.log('aggregateTransactionSigned.hash   : ' + signedTransaction.hash);
console.log('aggregateTransactionSigned.signer : ' + signedTransaction.signer);
console.log('aggregateTransactionSigned.payload: ' + signedTransaction.payload);



const signedTransaction3 = aggregateCompleteTransaction.signTransactionWithCosignatories(aliceAccount, []);
console.log('aggregateTransactionSigned.hash   : ' + signedTransaction3.hash);
console.log('aggregateTransactionSigned.signer : ' + signedTransaction3.signer);
console.log('aggregateTransactionSigned.payload: ' + signedTransaction3.payload);

const signedTransaction4 = aliceAccount.sign(aggregateCompleteTransaction);
console.log('aggregateTransactionSigned.hash   : ' + signedTransaction4.hash);
console.log('aggregateTransactionSigned.signer : ' + signedTransaction4.signer);
console.log('aggregateTransactionSigned.payload: ' + signedTransaction4.payload);

const signedTransaction2 = aliceAccount.sign(aggregateBondedTransaction);
console.log('aggregateTransactionSigned.hash   : ' + signedTransaction2.hash);
console.log('aggregateTransactionSigned.signer : ' + signedTransaction2.signer);
console.log('aggregateTransactionSigned.payload: ' + signedTransaction2.payload);

