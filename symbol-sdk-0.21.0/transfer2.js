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

const privateKeys = [
    "A3BD0C70A8037CC3BE7B6D43B341C34B310E519C54FF15EC6A34A962A94D2CA3",
    "688EC8F4A51AC56149B00390B9D47920383AAB12FED85237FF2A55A7F8EA65AA",
    "31C9B476C8615ED25C6AD1051AA6B4EE9B25167FF1B410F2FF108A2E28F9520A",
    "DBEB71101284C41E5DF1CE9C0DEF40D34205546AD0894BAA33DDCCA3DD03DCB6",
    "A7AB5CBE5690752F5CCFE516BFA10564FD0539C30C3904D3642F2C188880D8B4"
];
const addressTo = "TAR5SCEKZKUYGODYEXRAOZMBAI4LUAJ3ZHX6OTY";

/* end block 01 */

const networkGenerationHash = process.env.NETWORK_GENERATION_HASH;
const nodeUrl = nodeList[0];
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
const transactionHttp = repositoryFactory.createTransactionRepository();
const accountHttp = repositoryFactory.createAccountRepository();


const b = async () => {
    for (let i = 0; i < privateKeys.length; i++) {
        const privateKey = privateKeys[i];
        const account = Account.createFromPrivateKey(privateKey, networkType);
        await a(account);
    }
}

const a = async (account) => {

    const balance = await accountHttp
        .getAccountInfo(account.address)
        .toPromise()
        .then((accountInfo) => {
            return accountInfo
                .mosaics
                .filter((m) => m.id.toHex() === '5B66E76BECAD0860')
                .map((m) => m.amount.compact());
        })
        .then((balArray) => {
            if (balArray.length > 0) {
                return balArray[0]
            } else {
                return 0
            }
        })
        .catch((e) => {
            return 0
        });

    if (balance < 20000) {
        return;
    }

    const transferTransaction = TransferTransaction.create(
        Deadline.create(),
        Address.createFromRawAddress(addressTo),
        [NetworkCurrencyPublic.createAbsolute(balance - 20000)],
        PlainMessage.create(''),
        networkType,
        UInt64.fromUint(20000));
    const signedTransaction = account.sign(transferTransaction, networkGenerationHash);
    
    await transactionHttp
        .announce(signedTransaction)
        .toPromise()
        .then((x) => console.log(x))
        .catch((e) => console.error(e));
}


b();