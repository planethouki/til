process.env.PRIVATE_KEY = '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E';

const {
    Account,
    NetworkType
} = require('nem2-sdk');

const publicTestAccount = Account.createFromPrivateKey(process.env.PRIVATE_KEY, NetworkType.TEST_NET);
console.log(publicTestAccount.privateKey, publicTestAccount.publicKey, publicTestAccount.address.plain());

const mijinTestAccount = Account.createFromPrivateKey(process.env.PRIVATE_KEY, NetworkType.MIJIN_TEST);
console.log(mijinTestAccount.privateKey, mijinTestAccount.publicKey, mijinTestAccount.address.plain());
