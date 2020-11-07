const {
    Account,
    AccountKeyLinkTransaction,
    AggregateTransaction,
    Deadline,
    LinkAction,
    NetworkType,
    PersistentDelegationRequestTransaction,
    PersistentHarvestingDelegationMessage,
    PublicAccount,
    RepositoryFactoryHttp,
    UInt64,
} = require('symbol-sdk');

const fs = require('fs');

process.env.PRIVATE_KEY = 'A3BD0C70A8037CC3BE7B6D43B341C34B310E519C54FF15EC6A34A962A94D2CA3'
process.env.REMOTE_PRIVATE_KEY = '5AC26A439DD2F07F132579E7B63E1D1AC85738D4723C52854A49D7798661C538'
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

/* start block 01 */
const account = Account.createFromPrivateKey(process.env.PRIVATE_KEY, networkType);
const remoteAccount = Account.createFromPrivateKey(process.env.REMOTE_PRIVATE_KEY, networkType);
/* end block 01 */

/* start block 02 */
const accountLinkTransaction = AccountKeyLinkTransaction.create(
    Deadline.create(),
    remoteAccount.publicKey,
    LinkAction.Link,
    networkType);
/* end block 02 */

/* start block 03 */
const nodePublicKey = process.env.NODE_PUBLIC_KEY;
const nodePublicAccount = PublicAccount.createFromPublicKey(nodePublicKey, networkType);

const persistentDelegationRequestTransaction = PersistentDelegationRequestTransaction
    .create(
        Deadline.create(),
        nodePublicAccount.address,
        [],
        PersistentHarvestingDelegationMessage
            .create(remoteAccount.privateKey, account.privateKey, nodePublicKey, networkType),
        networkType);
/* end block 03 */

/* start block 04 */
const aggregateTransaction = AggregateTransaction.createComplete(
    Deadline.create(),
    [
        accountLinkTransaction.toAggregate(account.publicAccount),
        persistentDelegationRequestTransaction.toAggregate(account.publicAccount),
    ],
    networkType,
    [],
    UInt64.fromUint(10000000));

const networkGenerationHash = process.env.NETWORK_GENERATION_HASH;
const signedTransaction = account.sign(aggregateTransaction, networkGenerationHash);

const nodeUrl = nodeList[0];
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
const transactionHttp = repositoryFactory.createTransactionRepository();
transactionHttp
    .announce(signedTransaction)
    .subscribe(x=> console.log(x), err => console.error(err));
/* end block 04 */

fs.appendFileSync('./delegate1.log', JSON.stringify({
    date: new Date().toISOString(),
    hash: signedTransaction.hash,
    payload: signedTransaction.payload
}, null, "  "))
