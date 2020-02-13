const jssha3 = require('js-sha3');

const sha3_256 = jssha3.sha3_256;
const keccak256 = jssha3.keccak256;

const payload1 = '01004321e906a00eeab59f1688d10a0000000000166e98c52c0cd866e791928532a4275417430e153dd7bb673495a262960325d701004351e906a00eeab59f1688d10a0000000000';

const payload = payload1;
console.log(payload);
const hasher = sha3_256.create();
const hash = hasher.update(Buffer.from(payload, 'hex')).hex().toUpperCase();

console.log('hash: ' + hash);