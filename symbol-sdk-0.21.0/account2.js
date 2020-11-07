const {
    Account,
    AccountLinkTransaction,
    Address,
    AggregateTransaction,
    Deadline,
    LinkAction,
    NetworkType,
    PersistentDelegationRequestTransaction,
    PersistentHarvestingDelegationMessage,
    PublicAccount,
    RepositoryFactoryHttp,
    TransactionHttp,
    UInt64,
} = require('symbol-sdk');
const fs = require('fs');

const nodeList = [
    'http://api-01.ap-northeast-1.0.10.0.x.symboldev.network:3000',
    'http://api-01.ap-southeast-1.0.10.0.x.symboldev.network:3000',
    'http://api-01.eu-central-1.0.10.0.x.symboldev.network:3000',
    'http://api-01.eu-west-1.0.10.0.x.symboldev.network:3000',
    'http://api-01.us-east-1.0.10.0.x.symboldev.network:3000',
    'http://api-01.us-west-1.0.10.0.x.symboldev.network:3000'
]

const networkType = NetworkType.TEST_NET;

const read = JSON.parse(fs.readFileSync('./account1.json', 'utf-8'));

const nodeUrl = nodeList[0];
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
const accountHttp = repositoryFactory.createAccountRepository();

const hoge = async () => {
    const data = []

    for (let i = 0; i < read.length; i++) {
        const get = await accountHttp
            .getAccountInfo(Address.createFromRawAddress(read[i].address))
            .toPromise()
            .then((accountInfo) => {
                return accountInfo
                    .mosaics
                    .filter((m) => m.id.toHex() === '5B66E76BECAD0860')
                    .map((m) => `${m.id.toHex()}: ${m.amount.toString()}`)
                    .join(', ')
            })
            .catch((e) => {
                return null
            });
        data.push({
            ...read[i],
            mosaics: get ? get : ''
        })
    }

    fs.writeFileSync('./account2.json', JSON.stringify(data, null, "  "));
}

hoge()