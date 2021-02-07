const nodeList = [
    'http://api-01.ap-northeast-1.testnet.symboldev.network:3000',
    'http://api-01.ap-southeast-1.testnet.symboldev.network:3000',
    'http://api-01.eu-central-1.testnet.symboldev.network:3000',
    'http://api-01.eu-west-1.testnet.symboldev.network:3000',
    'http://api-01.us-east-1.testnet.symboldev.network:3000',
    'http://api-01.us-west-1.testnet.symboldev.network:3000'
]

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const node = nodeList[getRandomInt(nodeList.length)];

const WebSocket = require('ws');
const ws = new WebSocket(`${node.replace('http', 'ws')}/ws`, {
    perMessageDeflate: true
});
const axios = require('axios');

function formatTimestamp(str) {
    return new Date(Number(str) + 1459468800000).toISOString()
}

const blockHandler = (obj) => {
    console.log(obj);
    return;
    const blockPromise = axios.get('http://' + process.env.HOST + '/block/' + obj.block.height)
    const txPromise = axios.get('http://' + process.env.HOST + '/block/' + obj.block.height + '/transactions')
    Promise.all([blockPromise, txPromise]).then((results) => {
        const block = results[0].data;
        const txs = results[1].data;
        txs.map((tx) => {
            console.log(
                formatTimestamp(block.block.timestamp),
                block.block.feeMultiplier,
                tx.meta.hash,
                tx.transaction.maxFee
            )
        })
    })
}

ws.on('open', () => {
    // eslint-disable-next-line no-console
    console.log('connection open')
})
ws.on('close', () => {
    // eslint-disable-next-line no-console
    console.log('connection close')
})
ws.on('message', (e) => {
    // console.log('message', e)
    const obj = JSON.parse(e)
    if ('uid' in obj) {
        const msg = '{"uid": "' + obj.uid + '", "subscribe":"block"}'
        console.log('send', msg)
        ws.send(msg)
    } else if ('block' in obj) {
        blockHandler(obj)
    }
});