"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const address = "TAKPHWV4SIXXWLIGU2XVIS2Y4XH2ECM4SGYAO7A";
const endpoint = "http://api-01.ap-northeast-1.testnet.symboldev.network:3000";
const fs = require("fs");
const symbol_sdk_1 = require("symbol-sdk");
const f = new symbol_sdk_1.RepositoryFactoryHttp(endpoint);
const transactionHttp = f.createTransactionRepository();
const c = {
    group: symbol_sdk_1.TransactionGroup.Confirmed,
    address: symbol_sdk_1.Address.createFromRawAddress(address),
    pageSize: 2,
    type: [symbol_sdk_1.TransactionType.AGGREGATE_BONDED]
};
transactionHttp
    .search(c)
    .toPromise()
    .then((page) => {
    const id = page.data
        .map(t => { var _a; return ((_a = t.transactionInfo) === null || _a === void 0 ? void 0 : _a.hash) || ""; })
        .filter(h => h !== "");
    return transactionHttp
        .getTransactionsById(id, symbol_sdk_1.TransactionGroup.Confirmed)
        .toPromise();
})
    .then((data) => {
    const txsWithMosaicDef = data.filter((tx) => {
        const ag = tx;
        const md = ag.innerTransactions.filter((inner) => {
            return inner.type === symbol_sdk_1.TransactionType.MOSAIC_DEFINITION;
        });
        return md.length > 0;
    });
    // tslint:disable-next-line:no-console
    // console.log(result);
    const txsDto = txsWithMosaicDef.map((tx) => tx.toJSON());
    const out = JSON.stringify(txsDto, null, "  ");
    fs.writeFileSync("out.json", out);
    const input = JSON.parse(out);
    console.log(symbol_sdk_1.Convert.decodeHex(input[0].transaction.transactions[3].transaction.value));
    const b = txsWithMosaicDef
        .map((tx) => {
        const ag = tx;
        return ag.innerTransactions.filter((inner) => {
            return inner.type === symbol_sdk_1.TransactionType.MOSAIC_METADATA;
        });
    })
        .filter((mm) => {
        return mm.length > 0;
    })
        .map((mm) => {
        const mmtx = mm[0];
        return mmtx.value;
    });
    const d = b.map(t => JSON.parse(t));
    // tslint:disable-next-line:no-console
    console.log(d);
});
//# sourceMappingURL=nft1.js.map