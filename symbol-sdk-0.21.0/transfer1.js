const {
    Account,
    AccountLinkTransaction,
    Address,
    AggregateTransaction,
    Deadline,
    LinkAction,
    NetworkCurrencyPublic,
    NetworkType,
    PersistentDelegationRequestTransaction,
    PersistentHarvestingDelegationMessage,
    PlainMessage,
    PublicAccount,
    RepositoryFactoryHttp,
    TransactionHttp,
    TransferTransaction,
    UInt64,
} = require('symbol-sdk');

process.env.NETWORK_GENERATION_HASH = '6C1B92391CCB41C96478471C2634C111D9E989DECD66130C0430B5B8D20117CD';

const nodeList = [
    'http://api-01.ap-northeast-1.0.10.0.x.symboldev.network:3000',
    'http://api-01.ap-southeast-1.0.10.0.x.symboldev.network:3000',
    'http://api-01.eu-central-1.0.10.0.x.symboldev.network:3000',
    'http://api-01.eu-west-1.0.10.0.x.symboldev.network:3000',
    'http://api-01.us-east-1.0.10.0.x.symboldev.network:3000',
    'http://api-01.us-west-1.0.10.0.x.symboldev.network:3000'
]

const networkType = NetworkType.TEST_NET;

const privateKeyFrom = "A7AB5CBE5690752F5CCFE516BFA10564FD0539C30C3904D3642F2C188880D8B4";
const addressTo = "TC3C4I7DCRY7K3GFBHFVX55K6TPATRIAGA46SKY";

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    Address.createFromRawAddress(addressTo),
    [NetworkCurrencyPublic.createAbsolute(100000000000 - 19888)],
    PlainMessage.create(''),
    networkType,
    UInt64.fromUint(20000));
/* end block 01 */

/* start block 02 */
const privateKey = privateKeyFrom;
const account = Account.createFromPrivateKey(privateKey, networkType);
const networkGenerationHash = process.env.NETWORK_GENERATION_HASH;

const signedTransaction = account.sign(transferTransaction, networkGenerationHash);
/* end block 02 */

/* start block 03 */
const nodeUrl = nodeList[0];
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
const transactionHttp = repositoryFactory.createTransactionRepository();
transactionHttp
    .announce(signedTransaction)
    .subscribe(x => console.log(x), err => console.error(err));
/* end block 03 */

console.log(transferTransaction.toJSON())
console.log(signedTransaction);
