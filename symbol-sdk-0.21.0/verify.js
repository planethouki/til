// node v14.4.0
// symbol-sdk v0.21.0

const { Convert, KeyPair, PublicAccount, NetworkType } = require('symbol-sdk');

const publicKey = "717082D8AFB7E9CDED9A1281F96CFB90C985752E19178503BDABA596B0721567";
const signature = "BF51455E759C3CF55C1104B2699183328181EBAD68FD7B53DF53A88F99F633CFAC08C9D2D6E8B3EABEC0B6F017017737440AB6C0C92B74BA7B1EE2B71475BD06";
const hash = "17F752A6399550727919EB2EFFAC178D6F1DE964F06BABD711113020AD71D1DB";

const publicAccount = PublicAccount.createFromPublicKey(publicKey, NetworkType.MAIN_NET);

const is = publicAccount.verifySignature(hash, signature);

// false
console.log(is);
