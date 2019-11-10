process.env.HOST = 'jp5.nemesis.land:3000'

const WebSocket = require('ws');
const ws = new WebSocket('ws://' + process.env.HOST + '/ws', {
    perMessageDeflate: true
});
const axios = require('axios');


function formatTimestamp(str) {
    return new Date(Number(str) + 1459468800000).toISOString()
}

const blockHandler = (obj) => {
    
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
})
