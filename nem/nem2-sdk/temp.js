

const buf2 = Buffer.from("kHWOtHwo1hQ7qj3mqNnDGbUDob/Y54np4g==", "base64");
console.log(buf2.toString('hex').toUpperCase());

const jssha3 = require('js-sha3');
const sha3_512 = jssha3.sha3_512;
const proof = "6c39d7b8b22bf4639257";
const hash = sha3_512.create();
const secret = hash.update(Buffer.from(proof, 'hex')).hex().toUpperCase();

console.log(secret);

console.log(new Date().getTime());