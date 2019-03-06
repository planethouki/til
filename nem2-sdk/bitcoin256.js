const nem2lib = require("nem2-library");
var CryptoJS = require("crypto-js");


function endian(hex) {
    const uint8arr = nem2lib.convert.hexToUint8(hex)
    return nem2lib.convert.uint8ToHex(uint8arr.reverse())
}

function sha256 (input) {
    const words = CryptoJS.enc.Hex.parse(input)
    const hash = CryptoJS.SHA256(words)
    return hash.toString(CryptoJS.enc.Hex).toUpperCase()
}

const one = sha256("7cfb8200f71eb7981d3dda9e878d28d592c832353fb0834ac20b77fc660a33d6");
console.log(one)
const two = sha256(one)
console.log(endian(two))
