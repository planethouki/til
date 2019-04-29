const nem2lib = require("nem2-library")
const sha3_256 = require('js-sha3').sha3_256

module.exports = {
    toLE: function(hex) {
        const uint8arr = nem2lib.convert.hexToUint8(hex)
        return nem2lib.convert.uint8ToHex(uint8arr.reverse())
    },
    calcurateHash: function(hex) {
        const hash = sha3_256.create();
        hash.update(Buffer.from(hex, 'hex'))
        return hash.hex().toUpperCase()
    },
    hexToUint8: function(hex) {
        return nem2lib.convert.hexToUint8(hex)
    }
}