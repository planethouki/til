const nem2lib = require("nem2-library");
var CryptoJS = require("crypto-js");

const input = "3030"
const words = CryptoJS.enc.Hex.parse(input)
const hash = CryptoJS.RIPEMD160(words)
console.log(hash.toString(CryptoJS.enc.Hex).toUpperCase())