const {
    Account,
    Deadline,
    Listener,
    NetworkType,
    UInt64
} = require('nem2-sdk')

const listener = new Listener('https://jp5.nemesis.land:3001')

listener.open().then(() => {
    listener.newBlock().subscribe(
        (blockInfo) => {
            console.log(blockInfo)
        },
        (err) => {
            console.error(err)
            listener.close();
            console.log('connection close');
        }
    )
    
    process.on('SIGINT', () => {
        mongoclient.close();
        console.log('connection close');
        listener.close();
    })
})

