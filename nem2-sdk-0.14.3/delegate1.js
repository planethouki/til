const {
    Account,
    AccountLinkTransaction,
    AggregateTransaction,
    Deadline,
    LinkAction,
    NetworkType,
    PersistentDelegationRequestTransaction,
    PersistentHarvestingDelegationMessage,
    PublicAccount,
    TransactionHttp,
} = require('nem2-sdk');

process.env.PRIVATE_KEY = '991B308F88F6B345D454D960AC2D06B43F716CF04DE24300660BF728DF08637B'
process.env.NODE_PUBLIC_KEY = 'F104E2F2601284E4414EF02515BE72E25948848D607F7F3FB45838B89B3D03AC'
process.env.NETWORK_GENERATION_HASH = '546E643DC979E6D5315D75B1BCB4EEB38AD441CB9BE822E999EF528FE7345103'

/* start block 01 */
const accountPrivateKey = process.env.PRIVATE_KEY;
const account = Account.createFromPrivateKey(accountPrivateKey, NetworkType.MIJIN_TEST);

const remoteAccount = Account.generateNewAccount(NetworkType.MIJIN_TEST);
/* end block 01 */

/* start block 02 */
const accountLinkTransaction = AccountLinkTransaction.create(
    Deadline.create(),
    remoteAccount.publicKey,
    LinkAction.Link,
    NetworkType.MIJIN_TEST);
/* end block 02 */

/* start block 03 */
const nodePublicKey = process.env.NODE_PUBLIC_KEY;
const nodePublicAccount = PublicAccount.createFromPublicKey(nodePublicKey, NetworkType.MIJIN_TEST);

const persistentDelegationRequestTransaction = PersistentDelegationRequestTransaction
    .create(
        Deadline.create(),
        nodePublicAccount.address,
        [],
        PersistentHarvestingDelegationMessage
            .create(remoteAccount.privateKey, account.privateKey, nodePublicKey, NetworkType.MIJIN_TEST),
        NetworkType.MIJIN_TEST);
/* end block 03 */

/* start block 04 */
const aggregateTransaction = AggregateTransaction.createComplete(
    Deadline.create(),
    [
        accountLinkTransaction.toAggregate(account.publicAccount),
        persistentDelegationRequestTransaction.toAggregate(account.publicAccount),
    ],
    NetworkType.MIJIN_TEST,
    []);

const networkGenerationHash = process.env.NETWORK_GENERATION_HASH;
const signedTransaction = account.sign(aggregateTransaction, networkGenerationHash);

const nodeUrl = 'http://54.95.177.196:3000';
const transactionHttp = new TransactionHttp(nodeUrl);
transactionHttp
    .announce(signedTransaction)
    .subscribe(x=> console.log(x),err => console.error(err));
/* end block 04 */

