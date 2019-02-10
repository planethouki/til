const nem2lib = require("nem2-library");

/*
private: 7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4
public: 5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C
address: SBWEUWON6IBHCW5IC4EI6V6SMTVJGCJWGLF57UGK
*/

const signData = `AA8B8731D9C87C27CB27B349ACC0ABEE36596A8494967D9C7C05C544A07B73FA`;


const privateKey = '31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E';
const keypair = nem2lib.KeyPair.createKeyPairFromPrivateKeyString(privateKey);

const signature = nem2lib.KeyPair.sign(keypair, signData);


// console.log('publicKey: ' + nem2lib.convert.uint8ToHex(keypair.publicKey));
// console.log('signature: ' + nem2lib.convert.uint8ToHex(signature));

const jsonData = {"parentHash": signData, "signature": nem2lib.convert.uint8ToHex(signature), "signer": nem2lib.convert.uint8ToHex(keypair.publicKey)};

console.log(JSON.stringify(jsonData));