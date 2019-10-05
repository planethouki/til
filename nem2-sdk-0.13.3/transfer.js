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

process.env.HOST = ''

const recipient = Account.generateNewAccount(NetworkType.MIJIN_TEST)
const sender = Account.createFromPrivateKey(
    '3C9C49B0D682FBA7B5BBE1C75B7CDCCFB2A81707946AF5913CA9938EAD7F33EA',
    NetworkType.MIJIN_TEST
)

async function exec() {
    for (let i = 0; i < 100000; i++) {

        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            recipient.address,
            [new Mosaic(new NamespaceId('cat.currency'), UInt64.fromUint(100))],
            new PlainMessage(''),
            NetworkType.MIJIN_TEST,
            UInt64.fromUint(100000)
        )
        
        const signedTransaction = sender.sign(
            transferTransaction,
            'A8204C0DA4535DE01B3B51CF54D9D20D663059790C4422A83B7A079C596FE01F'
        );
        
        const transactionHttp = new TransactionHttp(process.env.HOST);
        transactionHttp.announce(signedTransaction);
    
        console.log(signedTransaction.hash);
    
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
}

exec();