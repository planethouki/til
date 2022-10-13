const polkadot = require('@polkadot/api');
const Keyring = polkadot.Keyring;

// known mnemonic, well, now it is - don't use it for funds
const MNEMONIC = 'sample split bamboo west visual approve brain fox arch impact relief smile';

// type: ed25519, ssFormat: 42 (all defaults)
const keyring = new Keyring();
const pair = keyring.createFromUri(MNEMONIC);

// use the default as setup on init
// 5CSbZ7wG456oty4WoiX6a1J88VUbrCXLhrKVJ9q95BsYH4TZ
console.log('Substrate generic', pair.address);

// adjust the default ss58Format for Kusama
// CxDDSH8gS7jecsxaRL9Txf8H5kqesLXAEAEgp76Yz632J9M
keyring.setSS58Format(2);
console.log('Kusama', pair.address);

// adjust the default ss58Format for Polkadot
// 1NthTCKurNHLW52mMa6iA8Gz7UFYW5UnM3yTSpVdGu4Th7h
keyring.setSS58Format(0);
console.log('Polkadot', pair.address);

// WKBzQuLqJjv7o6MJ1yDbfTQDYBipRE5j3pdXs2zwYsVsEWN
keyring.setSS58Format(5);
console.log('Astar', pair.address);
