// node v14.4.0
// symbol-hd-wallets v0.13.0

require('dotenv').config();
const { MnemonicPassPhrase, ExtendedKey, Wallet } = require("symbol-hd-wallets");
const { RawAddress, Convert, NetworkType } = require('symbol-sdk');

const DEFAULT_ACCOUNT_PATH = "m/44'/4343'/0'/0'/0'";
const VRF_ACCOUNT_PATH = "m/44'/4343'/0'/1'/0'";

const words = process.env.MNEMONIC;
const mnemonic = new MnemonicPassPhrase(words);

const xkey = ExtendedKey.createFromSeed(mnemonic.toSeed());
const wallet = new Wallet(xkey);

const optInAccount = wallet.getChildAccount(DEFAULT_ACCOUNT_PATH, NetworkType.MAIN_NET);
console.log("opt in account");
console.log(`public key: ${optInAccount.publicKey}`);
console.log(`address: ${optInAccount.address.plain()}`);
console.log(`address: ${optInAccount.address.pretty()}`);
console.log(`address: ${Buffer.from(RawAddress.stringToAddress(optInAccount.address.plain())).toString('hex')}`);

const vrfAccount = wallet.getChildAccount(VRF_ACCOUNT_PATH, NetworkType.MAIN_NET);
console.log("vrf account");
console.log(`private key: ${vrfAccount.privateKey}`);
console.log(`public key: ${vrfAccount.publicKey}`);
console.log(`address: ${vrfAccount.address.plain()}`);
console.log(`address: ${vrfAccount.address.pretty()}`);