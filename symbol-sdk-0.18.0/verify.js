const { 
    Account,
    Convert,
    NetworkType,
    KeyPair
} = require('nem2-sdk');

const networkType = NetworkType.TEST_NET

const initiator = Account.createFromPrivateKey(
    '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E',
    networkType
)

const convertedSignature = Convert.hexToUint8(
    ''
)
const convertedData = Convert.hexToUint8(
    ''
)


console.log(
    KeyPair.verify(Convert.hexToUint8(initiator.publicKey), convertedData, convertedSignature)
)