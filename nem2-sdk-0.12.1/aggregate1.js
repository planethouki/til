const {
    Account,
    Address,
    AggregateTransaction,
    Deadline,
    NetworkCurrencyMosaic,
    NetworkType,    
    PlainMessage,
    TransactionHttp,
    TransferTransaction,
    UInt64
} = require("nem2-sdk");

const numAddrs = 10;
const recipientAddresses = (() => { 
    const addrs = [];
    for (let i = 0; i < numAddrs; i++) {
        const newAddr = Account.generateNewAccount(NetworkType.MIJIN_TEST).address;
        addrs.push(newAddr);
    }
    return addrs;
})();
const generationHash = 'AC8EE4E2D1FEA3C84D5E8DC8D032B16FC86EB89B494B1D4A0A5E7CD66BC4AC30';
const privateKey = '7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4';

const transferTransactions = (() => {
    const txs = [];
    for (let i = 0; i < numAddrs; i++) {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            recipientAddresses[i],
            [NetworkCurrencyMosaic.createRelative(0)],
            PlainMessage.create(''),
            NetworkType.MIJIN_TEST,
            UInt64.fromUint(0)
        );
        txs.push(transferTransaction);
    }
    return txs;
})();

const account = Account.createFromPrivateKey(privateKey,NetworkType.MIJIN_TEST);

const aggregateTransaction = AggregateTransaction.createComplete(
    Deadline.create(),
    transferTransactions.map(tx => tx.toAggregate(account.publicAccount)),
    NetworkType.MIJIN_TEST,
    [],
    UInt64.fromUint(0)
);

const signedTransaction = account.sign(aggregateTransaction, generationHash);

// const transactionHttp = new TransactionHttp('http://13.114.200.132:3000');
// transactionHttp.announce(signedTransaction).subscribe(
//     x => console.log(x),
//     err => console.error(err)
// );

console.log('HASH:    ' + signedTransaction.hash);
console.log('SIGNER:  ' + signedTransaction.signer);
console.log('PAYLOAD: ' + signedTransaction.payload);