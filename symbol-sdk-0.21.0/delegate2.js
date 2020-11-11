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
    NodeKeyLinkTransaction,
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
    VrfKeyLinkTransaction
} = require('symbol-sdk');

const fs = require('fs');

process.env.PRIVATE_KEY = 'A68F71CFE7157A774C654FEC5E97AEB3574A886E98AD84C7571DFB8C002F2C87'
process.env.ANNOUNCE_PRIVATE_KEY = 'B02A8FFD635DDA63910616718E5D9E446C5CE380EBCC2876FC398CFBFE014CF2'
process.env.REMOTE_PRIVATE_KEY = '875FB4547B3D6AABAD5DCAFE241AAC40728499F368D1898513FA79D6EBCF35CF'
process.env.VRF_PRIVATE_KEY = '06C4E651898A76D1B586FA5D4508096753F64104144F41BADEFFCFA8DF4B33A6'
process.env.NODE_PUBLIC_KEY = 'D74B89EE9378DEBD510A4139F8E8B10B878E12956059CD9E13253CF3AD73BDEB'
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

const mainAccount = Account.createFromPrivateKey(process.env.PRIVATE_KEY, networkType);
const announceAccount = Account.createFromPrivateKey(process.env.ANNOUNCE_PRIVATE_KEY, networkType);
const remoteAccount = Account.createFromPrivateKey(process.env.REMOTE_PRIVATE_KEY, networkType);
const vrfAccount = Account.createFromPrivateKey(process.env.VRF_PRIVATE_KEY, networkType);
const nodePublicAccount = PublicAccount.createFromPublicKey(process.env.NODE_PUBLIC_KEY, networkType);

const nodeUrl = nodeList[1];
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
const transactionHttp = repositoryFactory.createTransactionRepository();

const networkGenerationHash = process.env.NETWORK_GENERATION_HASH

const account = () => {
    const linkTransaction = AccountKeyLinkTransaction.create(
        Deadline.create(),
        remoteAccount.publicKey,
        LinkAction.Link,
        networkType,
        UInt64.fromUint(1000000));

    const signedTransaction = mainAccount.sign(linkTransaction, networkGenerationHash);
    
    transactionHttp
        .announce(signedTransaction)
        .subscribe(x=> console.log(x), err => console.error(err));
        
    fs.appendFileSync('./delegate2.log', JSON.stringify({
        date: new Date().toISOString(),
        type: 'account link',
        hash: signedTransaction.hash,
        payload: signedTransaction.payload
    }, null, "  "))
}

const vrf = () => {
    const linkTransaction = VrfKeyLinkTransaction.create(
        Deadline.create(),
        vrfAccount.publicKey,
        LinkAction.Link,
        networkType,
        UInt64.fromUint(1000000));

    const signedTransaction = mainAccount.sign(linkTransaction, networkGenerationHash);
    
    transactionHttp
        .announce(signedTransaction)
        .subscribe(x=> console.log(x), err => console.error(err));
        
    fs.appendFileSync('./delegate2.log', JSON.stringify({
        date: new Date().toISOString(),
        type: 'vrf link',
        hash: signedTransaction.hash,
        payload: signedTransaction.payload
    }, null, "  "))
}

const node = (isLink) => {
    const linkTransaction = NodeKeyLinkTransaction.create(
        Deadline.create(),
        nodePublicAccount.publicKey,
        isLink ? LinkAction.Link : LinkAction.Unlink,
        networkType,
        UInt64.fromUint(1000000));

    const signedTransaction = mainAccount.sign(linkTransaction, networkGenerationHash);
    
    transactionHttp
        .announce(signedTransaction)
        .subscribe(x=> console.log(x), err => console.error(err));
        
    fs.appendFileSync('./delegate2.log', JSON.stringify({
        date: new Date().toISOString(),
        type: 'node link',
        hash: signedTransaction.hash,
        payload: signedTransaction.payload
    }, null, "  "))
}

const delegate = () => {

    const message = PersistentHarvestingDelegationMessage
        .create(remoteAccount.privateKey, vrfAccount.privateKey, nodePublicAccount.publicKey, networkType);
    const zeroSeq = '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
    const dummyMessage = PlainMessage.create(zeroSeq.substr(0, (message.payload.length - 2) / 2))

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
        "2A8061577301E2" +
        message.payload.substr("16");

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
        mainAccount.publicKey,
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
    case 'account':
        account();
        break;
    case 'vrf':
        vrf();
        break;
    case 'node':
        node(true);
        break;
    case 'node-unlink':
        node(false);
        break;
    case 'delegate':
        delegate();
        break;
    default:
        console.log('invalid args');
}