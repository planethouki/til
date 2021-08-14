import {
    Base32,
    Convert,
    Crypto,
    NetworkType,
    PublicAccount,
    RawAddress
} from 'symbol-sdk'


const privateKey = '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E'
const password = 'password'

const encrypted = Crypto.encrypt(privateKey, password)
// console.log(encrypted)

const a = PublicAccount.createFromPublicKey('713FA4446275F62173186194F4FE898917BC2C05C9273E000461951A3557A255', NetworkType.TEST_NET)
const b = PublicAccount.createFromPublicKey('713FA4446275F62173186194F4FE898917BC2C05C9273E000461951A3557A255', NetworkType.MAIN_NET)


console.log(a.address.plain(), Convert.uint8ToHex(RawAddress.stringToAddress(a.address.plain())))
console.log(b.address.plain(), Convert.uint8ToHex(RawAddress.stringToAddress(b.address.plain())))
