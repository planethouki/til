const address: string = "TAKPHWV4SIXXWLIGU2XVIS2Y4XH2ECM4SGYAO7A";
const endpoint: string = "http://api-01.ap-northeast-1.testnet.symboldev.network:3000";
const AGGREGATE_BONDED: number = 16961;
const MOSAIC_DEFINITION: number = 16717;
const MOSAIC_METADATA: number = 16964;
import * as fs from 'fs';
import axios from 'axios';

axios.request({
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
    const ids: string[] = res.data.data.map((item: any) => item.meta.hash)
    return axios.request({
        url: '/transactions/confirmed',
        method: 'post',
        baseURL: endpoint,
        data: {
            transactionIds: ids
        }
    })
}).then((res) => {
    fs.writeFileSync('out4-2.json', JSON.stringify(res.data, null, "  "));
    const f = res.data.filter((info: any) => {
        const mm: any[] = info.transaction.transactions.filter((inner: any) => {
            return inner.transaction.type === MOSAIC_METADATA;
        });
        return mm.length > 0;
    })
    fs.writeFileSync('out4-3.json', JSON.stringify(f, null, "  "));
})

