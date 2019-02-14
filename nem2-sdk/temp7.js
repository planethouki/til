const nem2Sdk = require("nem2-sdk");

const Address = nem2Sdk.Address,
    Deadline = nem2Sdk.Deadline,
    Account = nem2Sdk.Account,
    UInt64 = nem2Sdk.UInt64,
    NetworkType = nem2Sdk.NetworkType,
    PlainMessage = nem2Sdk.PlainMessage,
    TransferTransaction = nem2Sdk.TransferTransaction,
    Mosaic = nem2Sdk.Mosaic,
    MosaicId = nem2Sdk.MosaicId,
    TransactionHttp = nem2Sdk.TransactionHttp,
    XEM = nem2Sdk.XEM,
    AggregateTransaction = nem2Sdk.AggregateTransaction,
    PublicAccount = nem2Sdk.PublicAccount,
    LockFundsTransaction = nem2Sdk.LockFundsTransaction,
    Listener = nem2Sdk.Listener,
    CosignatureTransaction = nem2Sdk.CosignatureTransaction,
    AccountHttp = nem2Sdk.AccountHttp;

console.log(Account.createFromPrivateKey("25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E", NetworkType.MIJIN_TEST).address.plain())
console.log(Account.createFromPrivateKey("1b31f0bbb87891e747501c2b79103f986bd6f0b12b892eb0acfb78adbf9b3df1", NetworkType.MIJIN_TEST).address.plain())

const jssha3 = require('js-sha3');
const keccak256 = jssha3.keccak256;
const secret = "28D0A13C6ABAAB59A1EB94C6250FAE325C37C9B1EF2A7D9B37CEECFE59B84AB3";
console.log(keccak256.create().update(Buffer.from(secret, 'hex')).hex().toUpperCase());