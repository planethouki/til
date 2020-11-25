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

const privateKeyFrom = "A68F71CFE7157A774C654FEC5E97AEB3574A886E98AD84C7571DFB8C002F2C87";
const addressTo = "TCAGH46RHAWYOFMGMQZAM7RFDMAQNLOUQ2CCRPA";

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    Address.createFromRawAddress(addressTo),
    [NetworkCurrencyPublic.createAbsolute(1079992582667 - 20000)],
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
