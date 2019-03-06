const nem2lib = require('nem2-library');

function numberToMosaicNonce(input) {
    const hex = input.toString(16)
    const hex2 = '0000000'.concat(hex).substr(-8)
    return nem2lib.convert.hexToUint8(hex2)
}

console.log("hoge")
console.log(numberToMosaicNonce("01").reverse())