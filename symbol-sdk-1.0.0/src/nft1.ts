const address: string = "TAKPHWV4SIXXWLIGU2XVIS2Y4XH2ECM4SGYAO7A";
const endpoint: string = "http://api-01.ap-northeast-1.testnet.symboldev.network:3000";

import * as fs from 'fs';
import {
    Address,
    AggregateTransaction,
    Convert,
    InnerTransaction,
    MosaicMetadataTransaction,
    RepositoryFactoryHttp,
    Transaction,
    TransactionGroup,
    TransactionMapping,
    TransactionSearchCriteria,
    TransactionType
} from 'symbol-sdk';

const f = new RepositoryFactoryHttp(endpoint);
const transactionHttp = f.createTransactionRepository();
const c: TransactionSearchCriteria = {
    group: TransactionGroup.Confirmed,
    address: Address.createFromRawAddress(address),
    pageSize: 2,
    type: [TransactionType.AGGREGATE_BONDED]
};
transactionHttp
    .search(c)
    .toPromise()
    .then((page) => {
        const id: string[] = page.data
            .map(t => t.transactionInfo?.hash || "")
            .filter(h => h !== "");
        return transactionHttp
            .getTransactionsById(id, TransactionGroup.Confirmed)
            .toPromise()
    })
    .then((data) => {
        const txsWithMosaicDef: Transaction[] = data.filter((tx) => {
            const ag = tx as AggregateTransaction;
            const md = ag.innerTransactions.filter((inner) => {
                return inner.type === TransactionType.MOSAIC_DEFINITION
            });
            return md.length > 0;
        });
        // tslint:disable-next-line:no-console
        // console.log(result);
        const txsDto = txsWithMosaicDef.map((tx) => tx.toJSON());
        const out = JSON.stringify(txsDto, null, "  ");
        fs.writeFileSync("out.json", out);

        const input = JSON.parse(out);
        console.log(Convert.decodeHex(input[0].transaction.transactions[3].transaction.value));

        const b: string[] = txsWithMosaicDef
            .map((tx) => {
                const ag = tx as AggregateTransaction;
                return ag.innerTransactions.filter((inner) => {
                    return inner.type === TransactionType.MOSAIC_METADATA
                });
            })
            .filter((mm) => {
                return mm.length > 0;
            })
            .map((mm) => {
                const mmtx: MosaicMetadataTransaction = mm[0] as MosaicMetadataTransaction;
                return mmtx.value;
            });
        const d = b.map(t => JSON.parse(t));
        // tslint:disable-next-line:no-console
        console.log(d);
    });
