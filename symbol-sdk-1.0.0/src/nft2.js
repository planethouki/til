const {
    Address,
    AggregateTransaction,
    InnerTransaction,
    MosaicMetadataTransaction,
    Page,
    RepositoryFactoryHttp,
    Transaction,
    TransactionGroup,
    TransactionSearchCriteria,
    TransactionType
} = require('symbol-sdk');

const nft = async () => {
    const address = process.env.TARGET_ADDRESS;
    const endpoint = process.env.NODE_URL;

    const f = new RepositoryFactoryHttp(endpoint);
    const transactionHttp = f.createTransactionRepository();
    const c = {
        group: TransactionGroup.Confirmed,
        address: Address.createFromRawAddress(address),
        pageSize: 2,
        type: [TransactionType.AGGREGATE_BONDED]
    };
    const page = await transactionHttp
        .search(c)
        .toPromise();
    const id = page.data
        .map(t => t.transactionInfo?.hash || "")
        .filter(h => h !== "");
    const transactions = await transactionHttp
        .getTransactionsById(id, TransactionGroup.Confirmed)
        .toPromise();
    const a = transactions.filter((tx) => {
        const ag = tx;
        const md = ag.innerTransactions.filter((inner) => {
            return inner.type === TransactionType.MOSAIC_DEFINITION;
        });
        return md.length > 0;
    });
    return JSON.stringify(a, null, "  ");
}

module.exports = nft;
