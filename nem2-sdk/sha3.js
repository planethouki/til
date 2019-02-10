const jssha3 = require('js-sha3');

const sha3_256 = jssha3.sha3_256;

const payload = process.argv[2];
const hasher = sha3_256.create();
const hash = hasher.update(Buffer.from(payload, 'hex')).hex().toUpperCase();

console.log('hash :' + hash);