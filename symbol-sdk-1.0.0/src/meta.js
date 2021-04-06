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

const meta = async function (transactions) {

    const b = transactions
        .map((tx) => {
            const ag = tx;
            return ag.innerTransactions.filter((inner) => {
                return inner.type === TransactionType.MOSAIC_METADATA
            });
        })
        .filter((mm) => {
            return mm.length > 0;
        })
        .map((mm) => {
            const mmtx = mm[0];
            return mmtx.value;
        })
        .map((v) => JSON.parse(v));

    return JSON.stringify(b, null, "  ");
};

module.exports = meta;
