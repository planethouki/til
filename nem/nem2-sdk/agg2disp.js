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
    AccountHttp = nem2Sdk.AccountHttp,
    MosaicHttp = nem2Sdk.MosaicHttp,
    NamespaceHttp = nem2Sdk.NamespaceHttp,
    MosaicService = nem2Sdk.MosaicService,
    XEM = nem2Sdk.XEM,
    AggregateTransaction = nem2Sdk.AggregateTransaction,
    PublicAccount = nem2Sdk.PublicAccount,
    LockFundsTransaction = nem2Sdk.LockFundsTransaction,
    Listener = nem2Sdk.Listener,
    CosignatureTransaction = nem2Sdk.CosignatureTransaction,
    SecretLockTransaction = nem2Sdk.SecretLockTransaction,
    SecretProofTransaction = nem2Sdk.SecretProofTransaction,
    HashType = nem2Sdk.HashType;

const alicePrivateKeyPublic = '7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4';
const aliceAccountPublic = Account.createFromPrivateKey(alicePrivateKeyPublic, NetworkType.MIJIN_TEST);

const bobPrivateKeyPublic = '31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E';
const bobAccountPublic = Account.createFromPrivateKey(bobPrivateKeyPublic, NetworkType.MIJIN_TEST);

const carolPrivateKeyPublic = 'B332E3CA7B31D0BC663232B66D7C282BC2FE1DC0C01BB0159586A2CBEADD6B2A';
const carolAccountPublic = Account.createFromPrivateKey(carolPrivateKeyPublic, NetworkType.MIJIN_TEST);


const urlPublic = 'http://192.168.11.77:3000';


const transactionHttpPublic = new TransactionHttp(urlPublic);
const accountHttpPublic = new AccountHttp(urlPublic);
const mosaicHttpPublic = new MosaicHttp(urlPublic);
const namespaceHttpPublic = new NamespaceHttp(urlPublic);
const mosaicServicePublic = new MosaicService(accountHttpPublic, mosaicHttpPublic, namespaceHttpPublic);


const mosaicsAmountViewFromAddress = (logPrefix, mosaicService, address) => {
    mosaicService.mosaicsAmountViewFromAddress(address)
        .flatMap((_) => _)
        .subscribe(
            mosaic => console.log(logPrefix, mosaic.relativeAmount(), mosaic.fullName()),
            err => console.error(err)
        );
};
const timestamp = new Date().getTime();
mosaicsAmountViewFromAddress('[' + timestamp + '] Alice(Public) have', mosaicServicePublic, aliceAccountPublic.address);
mosaicsAmountViewFromAddress('[' + timestamp + '] Bob(Public) have', mosaicServicePublic, bobAccountPublic.address);
mosaicsAmountViewFromAddress('[' + timestamp + '] Carol(Public) have', mosaicServicePublic, carolAccountPublic.address);

