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



// Replace with private key
const alicePrivateKey = '31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E';

// Replace with public key
const ticketDistributorPublicKey = '5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C';

const aliceAccount = Account.createFromPrivateKey(alicePrivateKey, NetworkType.MIJIN_TEST);
const ticketDistributorPublicAccount = PublicAccount.createFromPublicKey( ticketDistributorPublicKey, NetworkType.MIJIN_TEST);

const aliceToTicketDistributorTx = TransferTransaction.create(
    Deadline.create(),
    ticketDistributorPublicAccount.address,
    [new Mosaic( new MosaicId('nem:xem'), UInt64.fromUint(100000000))],
    PlainMessage.create('send 100 nem:xem to distributor'),
    NetworkType.MIJIN_TEST,
);

const ticketDistributorToAliceTx = TransferTransaction.create(
    Deadline.create(),
    aliceAccount.address,
    [new Mosaic( new MosaicId('foo:bar'), UInt64.fromUint(1))],
    PlainMessage.create('send 1 foo:bar to alice'),
    NetworkType.MIJIN_TEST,
);

const aggregateTransaction = AggregateTransaction.createBonded(Deadline.create(),
    [
        aliceToTicketDistributorTx.toAggregate(aliceAccount.publicAccount),
        ticketDistributorToAliceTx.toAggregate(ticketDistributorPublicAccount),
    ],
    NetworkType.MIJIN_TEST);


const signedTransaction = aliceAccount.sign(aggregateTransaction);


// Creating the lock funds transaction

const lockFundsTransaction = LockFundsTransaction.create(
    Deadline.create(),
    new Mosaic( new MosaicId('nem:xem'), UInt64.fromUint(10000000)),
    UInt64.fromUint(480),
    signedTransaction,
    NetworkType.MIJIN_TEST);

const lockFundsTransactionSigned = aliceAccount.sign(lockFundsTransaction);

const transactionHttp = new TransactionHttp('http://localhost:3000');



transactionHttp.announce(lockFundsTransactionSigned).subscribe(x => console.log(x),
err => console.error(err));

setTimeout(() => transactionHttp.announceAggregateBonded(signedTransaction).subscribe(x => {console.log(x); console.log('foo')},
err => console.error(err)),30000);



// // announce signed transaction
// const listener = new Listener('http://localhost:3000');

// listener.open().then(() => {

//     transactionHttp.announce(lockFundsTransactionSigned).subscribe(x => console.log(x),
//         err => console.error(err));

//     listener.confirmed(aliceAccount.address)
//         .filter((transaction) => transaction.transactionInfo !== undefined
//             && transaction.transactionInfo.hash === lockFundsTransactionSigned.hash)
//         .flatMap(ignored => transactionHttp.announceAggregateBonded(signedTransaction))
//         .subscribe(announcedAggregateBonded => console.log(announcedAggregateBonded),
//             err => console.error(err));


//     // listener.confirmed(aliceAccount.address)
//     //     .flatMap(ignored => transactionHttp.announceAggregateBonded(signedTransaction))
//     //     .subscribe(announcedAggregateBonded => console.log(announcedAggregateBonded),
//     //         err => console.error(err));
// });


console.log('lockFundsTransactionSigned.hash  : ' + lockFundsTransactionSigned.hash);
console.log('lockFundsTransactionSigned.signer: ' + lockFundsTransactionSigned.signer);
console.log('aggregateTransactionSigned.hash  : ' + signedTransaction.hash);
console.log('aggregateTransactionSigned.signer: ' + signedTransaction.signer);
