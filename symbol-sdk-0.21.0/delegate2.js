const {
    Account,
    AccountKeyLinkTransaction,
    AggregateTransaction,
    Convert,
    Deadline,
    EncryptedMessage,
    KeyPair,
    LinkAction,
    NetworkType,
    PersistentDelegationRequestTransaction,
    PersistentHarvestingDelegationMessage,
    PlainMessage,
    PublicAccount,
    RepositoryFactoryHttp,
    SignedTransaction,
    Transaction,
    TransactionType,
    TransferTransaction,
    UInt64,
} = require('symbol-sdk');

const fs = require('fs');

process.env.PRIVATE_KEY = '6592A8F4056F2FE3AF645F989B557D8F94B888E8F52416001D030E6415036CB8'
process.env.ANNOUNCE_PRIVATE_KEY = 'B02A8FFD635DDA63910616718E5D9E446C5CE380EBCC2876FC398CFBFE014CF2'
process.env.REMOTE_PRIVATE_KEY = '262A59205AC2E1E8557A1BB6D99E419FBB5A5901743F61045A2281F171C1ED05'
process.env.NODE_PUBLIC_KEY = '70E06C112848A652D635755B7530D3096A978321D09B8D8DC17505CAE09565C5'
process.env.NETWORK_GENERATION_HASH = '6C1B92391CCB41C96478471C2634C111D9E989DECD66130C0430B5B8D20117CD'

const nodeList = [
    'http://api-01.ap-northeast-1.0.10.0.x.symboldev.network:3000',
    'http://api-01.ap-southeast-1.0.10.0.x.symboldev.network:3000',
    'http://api-01.eu-central-1.0.10.0.x.symboldev.network:3000',
    'http://api-01.eu-west-1.0.10.0.x.symboldev.network:3000',
    'http://api-01.us-east-1.0.10.0.x.symboldev.network:3000',
    'http://api-01.us-west-1.0.10.0.x.symboldev.network:3000'
]

const networkType = NetworkType.TEST_NET;

const account = Account.createFromPrivateKey(process.env.PRIVATE_KEY, networkType);
const announceAccount = Account.createFromPrivateKey(process.env.ANNOUNCE_PRIVATE_KEY, networkType);
const remoteAccount = Account.createFromPrivateKey(process.env.REMOTE_PRIVATE_KEY, networkType);

const nodeUrl = nodeList[0];
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
const transactionHttp = repositoryFactory.createTransactionRepository();

const networkGenerationHash = process.env.NETWORK_GENERATION_HASH

const link = () => {
    const accountLinkTransaction = AccountKeyLinkTransaction.create(
        Deadline.create(),
        remoteAccount.publicKey,
        LinkAction.Link,
        networkType,
        UInt64.fromUint(1000000));

    const signedTransaction = account.sign(accountLinkTransaction, networkGenerationHash);
    
    transactionHttp
        .announce(signedTransaction)
        .subscribe(x=> console.log(x), err => console.error(err));
        
    fs.appendFileSync('./delegate2.log', JSON.stringify({
        date: new Date().toISOString(),
        type: 'link',
        hash: signedTransaction.hash,
        payload: signedTransaction.payload
    }, null, "  "))
}

const delegate = () => {
    const nodePublicKey = process.env.NODE_PUBLIC_KEY;
    const nodePublicAccount = PublicAccount.createFromPublicKey(nodePublicKey, networkType);

    const message = PersistentHarvestingDelegationMessage
        .create(remoteAccount.privateKey, account.privateKey, nodePublicKey, networkType);
    const zeroSeq = '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
    const dummyMessage = PlainMessage.create(zeroSeq.substr(0, message.payload.length / 2))

    let persistentDelegationRequestTransaction = TransferTransaction
        .create(
            Deadline.create(),
            nodePublicAccount.address,
            [],
            dummyMessage,
            networkType,
            UInt64.fromUint(1000000));

    let signedTransaction = announceAccount.sign(persistentDelegationRequestTransaction, networkGenerationHash);

    let signedTransactionPayload = 
        signedTransaction.payload.substr(0, 320) +
        message.type.toString(16).toUpperCase() + 
        message.payload;

    const sign = (account, generationHash, signedTransactionPayload) => {
        const generationHashBytes = Array.from(Convert.hexToUint8(generationHash));
        const byteBuffer = Array.from(Convert.hexToUint8(signedTransactionPayload)).slice(4 + 64 + 32 + 8);
        const signingBytes = generationHashBytes.concat(byteBuffer);
        const keyPairEncoded = KeyPair.createKeyPairFromPrivateKeyString(account.privateKey);
        const signature = Array.from(KeyPair.sign(keyPairEncoded, new Uint8Array(signingBytes)));
        return Buffer.from(signature).toString('hex').toUpperCase()
    }

    signedTransactionPayload = 
        signedTransactionPayload.substr(0, (4 + 4) * 2) +
        sign(announceAccount, networkGenerationHash, signedTransactionPayload) +
        signedTransactionPayload.substr((4 + 4 + 64) * 2);


    const hash = (signedTransactionPayload, generationHash) => {
        return Transaction.createTransactionHash(
            signedTransactionPayload,
            Array.from(Convert.hexToUint8(generationHash))
        )
    }

    signedTransaction = new SignedTransaction(
        signedTransactionPayload,
        hash(signedTransactionPayload, networkGenerationHash),
        account.publicKey,
        TransactionType.TransferTransaction,
        networkType
    )

    transactionHttp
        .announce(signedTransaction)
        .subscribe(x=> console.log(x), err => console.error(err));

    fs.appendFileSync('./delegate2.log', JSON.stringify({
        date: new Date().toISOString(),
        type: 'delegate',
        hash: signedTransaction.hash,
        payload: signedTransaction.payload
    }, null, "  "))

}

if (process.argv.length < 3) {
    console.log('args required');
    return;
}

switch(process.argv[2]) {
    case 'link':
        link();
        break;
    case 'delegate':
        delegate();
        break;
    default:
        console.log('nothing');
}