
const base64ToHex = function (base64Str) {
    const buffer = Buffer.from(base64Str, 'base64')
    return buffer.toString('hex')
}

console.log(base64ToHex("kAGIO4JqFcmzkMOj/rlAm4Vo/YDN4MjSTg=="))

