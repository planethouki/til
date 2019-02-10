const nem2lib = require("nem2-library");
const nem2Sdk = require("nem2-sdk");
const jssha3 = require('js-sha3');

const Address = nem2Sdk.Address,
    Deadline = nem2Sdk.Deadline,
    Account = nem2Sdk.Account,
    UInt64 = nem2Sdk.UInt64,
    NetworkType = nem2Sdk.NetworkType,
    PlainMessage = nem2Sdk.PlainMessage,
    TransferTransaction = nem2Sdk.TransferTransaction,
    Mosaic = nem2Sdk.Mosaic,
    MosaicId = nem2Sdk.MosaicId,
    TransactionHttp = nem2Sdk.TransactionHttp,
    XEM = nem2Sdk.XEM,
    AggregateTransaction = nem2Sdk.AggregateTransaction,
    PublicAccount = nem2Sdk.PublicAccount,
    LockFundsTransaction = nem2Sdk.LockFundsTransaction,
    Listener = nem2Sdk.Listener;


/* 3000 network (Public)
Alice:
  private: 7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4
  public: 5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C
  address: SBWEUWON6IBHCW5IC4EI6V6SMTVJGCJWGLF57UGK
Bob:
  private: 31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E
  public: 3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57
  address: SB2Y5ND4FDLBIO5KHXTKRWODDG2QHIN73DTYT2PC
carol:
  private: B332E3CA7B31D0BC663232B66D7C282BC2FE1DC0C01BB0159586A2CBEADD6B2A
  public: 543BB01DFEEA0D9A25ADDE515DACC72F2125A8AAE85EDD682D77251E2C4EC174
  address: SBDG7U6NY7MTNOXKVK2JFZDLK2KSCRFPXDZ7IC3Q
*/

const bobPrivateKey = '31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E';

const payload = '6A0100008ECAC8C968C713EA4642FAEACBA85E8CD4AF02CFC0A034CF3FC01C95D44BADE094C890D8D79756B92E50392E246A1DF0E0F21A9D18FCD580793C5377BFC156035D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C029041410000000000000000E8CCAB6D10000000EE000000770000005D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C0390544190758EB47C28D6143BAA3DE6A8D9C319B503A1BFD8E789E9E22300010073656E6420313030206E656D3A78656D20746F20626F622066726F6D20616C69636529CF5FD941AD25D500E1F50500000000770000003390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD5703905441906C4A59CDF202715BA817088F57D264EA93093632CBDFD0CA2300010073656E6420313030206E656D3A78656D20746F20616C6963652066726F6D20626F6229CF5FD941AD25D500E1F50500000000';

const byteBuffer = Array.from(nem2lib.convert.hexToUint8(payload));

if (nem2lib.convert.uint8ToHex(byteBuffer.slice(100,100 + 4)) != '02904141') {
    throw new Error("must be aggregate complete transaction payload");
}

const txsize = nem2lib.convert.uint8ToHex(byteBuffer.slice(120, 120 + 4));
const littleEndianTxSize = txsize.substr(6, 2) + txsize.substr(4, 2) + txsize.substr(2, 2) + txsize.substr(0, 2);
const txSize = parseInt(littleEndianTxSize,16);

const hashingBytes = byteBuffer
    .slice(4, 36)
    .concat(byteBuffer
        .slice(4 + 64, 4 + 64 + 32))
    .concat(byteBuffer
        .slice(4 + 64 + 32, 4 + 64 + 32 + 2 + 2 + 8 + 8 + 4 + txSize));

const sha3_256 = jssha3.sha3_256;
const hasher = sha3_256.create();
const hash = hasher.update(Buffer.from(nem2lib.convert.uint8ToHex(hashingBytes), 'hex')).hex().toUpperCase();

const signData = hash;
const keypair = nem2lib.KeyPair.createKeyPairFromPrivateKeyString(bobPrivateKey);
const signature = nem2lib.KeyPair.sign(keypair, signData);


const newSize = `00000000${((payload.length / 2) + (96 * 1)).toString(16).toUpperCase()}`;
const newFormatedSize = newSize.substr(newSize.length - 8, newSize.length);
const newLittleEndianSize = newFormatedSize.substr(6, 2) + newFormatedSize.substr(4, 2) + newFormatedSize.substr(2, 2) + newFormatedSize.substr(0, 2);

const newPayload = newLittleEndianSize + payload.substr(8) + nem2lib.convert.uint8ToHex(keypair.publicKey) + nem2lib.convert.uint8ToHex(signature);

console.log(newPayload);

// console.log('hash :' + hash);
// console.log('publicKey: ' + nem2lib.convert.uint8ToHex(keypair.publicKey));
// console.log('signature: ' + nem2lib.convert.uint8ToHex(signature));

// const jsonData = {"parentHash": hash, "signature": nem2lib.convert.uint8ToHex(signature), "signer": nem2lib.convert.uint8ToHex(keypair.publicKey)};
// console.log(JSON.stringify(jsonData));