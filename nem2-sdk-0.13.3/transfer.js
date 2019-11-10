const {
    Account,
    Deadline,
    NetworkType,
    PlainMessage,
    Mosaic,
    MosaicId,
    NamespaceId,
    TransactionHttp,
    TransferTransaction,
    UInt64
} = require('nem2-sdk')

process.env.HOST = 'http://jp5.nemesis.land:3000'
process.env.GENERATION_HASH = '17FA4747F5014B50413CCF968749604D728D7065DC504291EEE556899A534CBB'
process.env.PRIVATE_KEY = '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E'
process.env.CURRENCY_NAMESPACE = 'nem.xem'

// process.env.HOST = 'http://jp5.nemesis.land:3000'
// process.env.GENERATION_HASH = 'A8204C0DA4535DE01B3B51CF54D9D20D663059790C4422A83B7A079C596FE01F'
// process.env.PRIVATE_KEY = '3C9C49B0D682FBA7B5BBE1C75B7CDCCFB2A81707946AF5913CA9938EAD7F33EA'
// process.env.CURRENCY_NAMESPACE = 'cat.currency'

const sender = Account.createFromPrivateKey(
    process.env.PRIVATE_KEY,
    NetworkType.MIJIN_TEST
)

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

async function exec() {
    for (let i = 0; i < 100000; i++) {
        // const recipient = Account.generateNewAccount(NetworkType.MIJIN_TEST)
        const recipient = sender

        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            recipient.address,
            [new Mosaic(new NamespaceId(process.env.CURRENCY_NAMESPACE), UInt64.fromUint(0))],
            new PlainMessage(''),
            NetworkType.MIJIN_TEST,
            UInt64.fromUint(getRandomInt(141, 1000) ** 2)
        )
        
        const signedTransaction = sender.sign(
            transferTransaction,
            process.env.GENERATION_HASH
        );
        
        const transactionHttp = new TransactionHttp(process.env.HOST);
        transactionHttp.announce(signedTransaction);
    
        console.log(signedTransaction.hash);
    
        await new Promise((resolve) => setTimeout(resolve, 15000));
    }
}

exec();