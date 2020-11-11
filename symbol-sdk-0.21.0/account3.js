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
const privateKey = '';

const account = Account.createFromPrivateKey(privateKey, networkType);

const out = {
    address: account.address.plain(),
    publicKey: account.publicKey,
    privateKey: account.privateKey,
    date: new Date().toISOString()
}
console.log(out)

