const nem2Sdk = require("nem2-sdk");
const op = require('rxjs/operators');

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
    MultisigCosignatoryModification = nem2Sdk.MultisigCosignatoryModification,
    TransactionType = nem2Sdk.TransactionType;

const filter = op.filter,
    map = op.map,
    flatMap = op.flatMap;


// Replace with private key
const alicePrivateKey = 'BA46F91D7BCD40B6482E138F0D3D53A29F0A6097B5C4586C6ABD81A3BA3A2DAD';
const aliceAccount = Account.createFromPrivateKey(alicePrivateKey, NetworkType.MIJIN_TEST);

// Replace with public key
const ticketDistributorPrivateKey = 'C36F5BDDE8B2B586D17A4E6F4B999DD36EBD114023C1231E38ABCB1976B938C0';
const ticketDistributorAccount = Account.createFromPrivateKey(ticketDistributorPrivateKey, NetworkType.MIJIN_TEST);
const ticketDistributorPublicAccount = ticketDistributorAccount.publicAccount;

const guarantorPrivateKey = '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E';
const guarantorAccount = Account.createFromPrivateKey(guarantorPrivateKey, NetworkType.MIJIN_TEST);






const aliceToTicketDistributorTx = TransferTransaction.create(
    Deadline.create(),
    ticketDistributorPublicAccount.address,
    [new Mosaic( new MosaicId('nem:xem'), UInt64.fromUint(1000000))],
    PlainMessage.create('send 1 nem:xem to distributor'),
    NetworkType.MIJIN_TEST,
);

const ticketDistributorToAliceTx = TransferTransaction.create(
    Deadline.create(),
    aliceAccount.address,
    [new Mosaic( new MosaicId('ticket:art'), UInt64.fromUint(1))],
    PlainMessage.create('send 1 ticket:art to alice'),
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

const lockFundsTransactionSigned = guarantorAccount.sign(lockFundsTransaction);

// const url = "http://catapult-test.44uk.net:3000";
// const url = 'http://192.168.11.77:3000'
// const url = 'https://planethouki.ddns.net:3000';
const url = 'http://catapult48gh23s.xyz:3000';

const transactionHttp = new TransactionHttp(url);
const listener = new Listener(url);


const cosignAggregateBondedTransaction = (transaction, account)  => {
    const cosignatureTransaction = CosignatureTransaction.create(transaction);
    const signedTransaction = account.signCosignatureTransaction(cosignatureTransaction);
    console.log('cosignatureTransaction.parentHash : ' + signedTransaction.parentHash);
    console.log('cosignatureTransaction.signer     : ' + signedTransaction.signer);
    return signedTransaction;
};


listener.open().then(() => {

    transactionHttp.announce(lockFundsTransactionSigned).subscribe(
        x => console.log(x),
        err => console.error(err)
    );

    listener.confirmed(guarantorAccount.address)
        .pipe(
            filter((transaction) => transaction.transactionInfo !== undefined
            && transaction.transactionInfo.hash === lockFundsTransactionSigned.hash),
            flatMap(ignored => transactionHttp.announceAggregateBonded(signedTransaction))
        )
        .subscribe(
            announcedAggregateBonded => {
                console.log(announcedAggregateBonded);
            },
            err => console.error(err)
        );

    listener.aggregateBondedAdded(ticketDistributorPublicAccount.address)
        .pipe(
            filter((_) => !_.signedByAccount(ticketDistributorPublicAccount)),
            map(transaction => cosignAggregateBondedTransaction(transaction, ticketDistributorAccount)),
            flatMap(cosignatureSignedTransaction => transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction))
        )
        .subscribe(
            announcedTransaction => {
                console.log(announcedTransaction);
                listener.close();
            },
            err => console.error(err)
        );

}).catch((error) => {
    console.error(error);
});


console.log('lockFundsTransactionSigned.hash  : ' + lockFundsTransactionSigned.hash);
console.log('lockFundsTransactionSigned.signer: ' + lockFundsTransactionSigned.signer);
console.log('aggregateTransactionSigned.hash  : ' + signedTransaction.hash);
console.log('aggregateTransactionSigned.signer: ' + signedTransaction.signer);
