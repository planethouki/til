"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const address = "TAKPHWV4SIXXWLIGU2XVIS2Y4XH2ECM4SGYAO7A";
const endpoint = "http://api-01.ap-northeast-1.testnet.symboldev.network:3000";
const AGGREGATE_BONDED = 16961;
const MOSAIC_DEFINITION = 16717;
const MOSAIC_METADATA = 16964;
const fs = require("fs");
const axios_1 = require("axios");
axios_1.default.request({
    url: '/transactions/confirmed',
    method: 'get',
    baseURL: endpoint,
    params: {
        address: address.replace('-', ''),
        pageSize: 2,
        type: AGGREGATE_BONDED
    }
}).then((res) => {
    fs.writeFileSync('out4-1.json', JSON.stringify(res.data, null, "  "));
    const ids = res.data.data.map((item) => item.meta.hash);
    return axios_1.default.request({
        url: '/transactions/confirmed',
        method: 'post',
        baseURL: endpoint,
        data: {
            transactionIds: ids
        }
    });
}).then((res) => {
    fs.writeFileSync('out4-2.json', JSON.stringify(res.data, null, "  "));
    const f = res.data.filter((info) => {
        const mm = info.transaction.transactions.filter((inner) => {
            return inner.transaction.type === MOSAIC_METADATA;
        });
        return mm.length > 0;
    });
    fs.writeFileSync('out4-3.json', JSON.stringify(f, null, "  "));
});
//# sourceMappingURL=nft4.js.map