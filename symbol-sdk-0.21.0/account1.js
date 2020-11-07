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
    UInt64,
} = require('symbol-sdk');
const fs = require('fs');

const networkType = NetworkType.TEST_NET;

const account = Account.generateNewAccount(networkType);

const out = {
    address: account.address.plain(),
    publicKey: account.publicKey,
    privateKey: account.privateKey,
    date: new Date().toISOString()
}
console.log(out)
const read = JSON.parse(fs.readFileSync('./account1.json', 'utf-8'));

const rev = read.reverse();
rev.push(out)
const reRev = rev.reverse();
const log = JSON.stringify(reRev, null, "  ")

fs.writeFileSync('./account1.json', log);