const polkadot = require('@polkadot/api');
const Keyring = polkadot.Keyring;

const MNEMONIC = 'bottom drive obey lake curtain smoke basket hold race lonely fit walk';
const keyring = new Keyring();
const pair = keyring.createFromUri(MNEMONIC);

console.log(pair.address);
// our default dev addresses with hard derivation
// (no mnemonic, defaulted to known)
console.log(keyring.createFromUri('//Alice').address);
// console.log(keyring.createFromUri('//Bob').address);
// console.log(keyring.createFromUri('//Charlie').address);
// console.log(keyring.createFromUri('//Dave').address);
// console.log(keyring.createFromUri('//Eve').address);
// console.log(keyring.createFromUri('//Ferdie').address);
