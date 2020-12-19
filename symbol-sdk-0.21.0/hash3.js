const crypto = require("crypto")
const jssha3 = require('js-sha3')
const sha3_256 = jssha3.sha3_256

const d = Buffer.from('986EAE5FF2099CCA9555D84931E327A5D821ED7EC8D24C13', 'hex');
const hash = sha3_256.create();
const h = hash.update(d).hex().toUpperCase();
console.log(h);