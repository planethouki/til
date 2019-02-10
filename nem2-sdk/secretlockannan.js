const nem2Sdk = require("nem2-sdk");
const crypto = require("crypto");
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
    AccountHttp = nem2Sdk.AccountHttp,
    MosaicHttp = nem2Sdk.MosaicHttp,
    NamespaceHttp = nem2Sdk.NamespaceHttp,
    MosaicService = nem2Sdk.MosaicService,
    XEM = nem2Sdk.XEM,
    AggregateTransaction = nem2Sdk.AggregateTransaction,
    PublicAccount = nem2Sdk.PublicAccount,
    LockFundsTransaction = nem2Sdk.LockFundsTransaction,
    Listener = nem2Sdk.Listener,
    CosignatureTransaction = nem2Sdk.CosignatureTransaction,
    SecretLockTransaction = nem2Sdk.SecretLockTransaction,
    SecretProofTransaction = nem2Sdk.SecretProofTransaction,
    HashType = nem2Sdk.HashType;

const sha3_512 = jssha3.sha3_512;

/* 3000 network (Public)
Alice:
  private: 7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4
  public: 5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C
  address: SBWEUWON6IBHCW5IC4EI6V6SMTVJGCJWGLF57UGK
Bob:
  private: 31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E
  public: 3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57
  address: SB2Y5ND4FDLBIO5KHXTKRWODDG2QHIN73DTYT2PC
command:
  - nem2-cli profile create -p 7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4 -n MIJIN_TEST -u http://192.168.11.77:3000 --profile alice30
  - nem2-cli profile create -p 31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E -n MIJIN_TEST -u http://192.168.11.77:3000 --profile bob30
  - nem2-cli transaction namespace -n foo -r -d 1000 --profile alice30
  - nem2-cli transaction mosaic -m bar -n foo -a 100 -t -d 0 -u 1000 --profile alice30
*/


const alicePrivateKeyPrivate = '8CBA73B9DF31D85DCFA4B9E1D3B7A88E5A5F32C930FCC45FE5A457619F3E6687';
const aliceAccountPrivate = Account.createFromPrivateKey(alicePrivateKeyPrivate, NetworkType.MIJIN_TEST);
const alicePrivateKeyPublic = '7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4';
const aliceAccountPublic = Account.createFromPrivateKey(alicePrivateKeyPublic, NetworkType.MIJIN_TEST);

const bobPrivateKeyPrivate = 'BA46F91D7BCD40B6482E138F0D3D53A29F0A6097B5C4586C6ABD81A3BA3A2DAD';
const bobAccountPrivate = Account.createFromPrivateKey(bobPrivateKeyPrivate, NetworkType.MIJIN_TEST);
const bobPrivateKeyPublic = '31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E';
const bobAccountPublic = Account.createFromPrivateKey(bobPrivateKeyPublic, NetworkType.MIJIN_TEST);


const aliceAddressPrivate = Address.createFromRawAddress('SBNRDTMZ3MF4RFNQA2ZA33G74EGTINCKX2EHYYHY');
const aliceAddressPublic = Address.createFromRawAddress('SBWEUWON6IBHCW5IC4EI6V6SMTVJGCJWGLF57UGK');
const bobAddressPrivate = Address.createFromRawAddress('SCBCMLVDJBXARCOI6XSKEU3ER2L6HH7UBEPTENGQ');
const bobAddressPublic = Address.createFromRawAddress('SB2Y5ND4FDLBIO5KHXTKRWODDG2QHIN73DTYT2PC');

const urlPublic = 'http://192.168.11.77:3000';

const listenerPublic = new Listener(urlPublic);
const transactionHttpPublic = new TransactionHttp(urlPublic);
const accountHttpPublic = new AccountHttp(urlPublic);
const mosaicHttpPublic = new MosaicHttp(urlPublic);
const namespaceHttpPublic = new NamespaceHttp(urlPublic);
const mosaicServicePublic = new MosaicService(accountHttpPublic, mosaicHttpPublic, namespaceHttpPublic);

const alisBobMosaicsAmountView = () => {
    const mosaicsAmountViewFromAddress = (logPrefix, mosaicService, address) => {
        mosaicService.mosaicsAmountViewFromAddress(address)
            .flatMap((_) => _)
            .subscribe(
                mosaic => console.log(logPrefix, mosaic.relativeAmount(), mosaic.fullName()),
                err => console.error(err)
            );
    };
    mosaicsAmountViewFromAddress('[Before] Alice(Public) have', mosaicServicePublic, aliceAccountPublic.address);
    mosaicsAmountViewFromAddress('[Before] Bob(Public) have', mosaicServicePublic, bobAccountPublic.address);
};

alisBobMosaicsAmountView();

// Alice picks a random number and hashes it.
const random = crypto.randomBytes(10);
const hash = sha3_512.create();
const secret = hash.update(random).hex().toUpperCase();
const proof = random.toString('hex');

console.log('x    (proof)     : ' + proof);
console.log('H(x) (secret)    : ' + secret);


setTimeout(() => {
    // Alice is a PUBLIC net user
    // const alicePrivateKeyPublic = '7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4';
    // const aliceAccountPublic = Account.createFromPrivateKey(alicePrivateKeyPublic, NetworkType.MIJIN_TEST);

    // Alice creates creates TX1 SecretLockTransaction{ H(x), B, MosaicId, Amount, valid for 96h }
    const tx1 = SecretLockTransaction.create(
        Deadline.create(),
        new Mosaic(new MosaicId('nem:xem'), UInt64.fromUint(1000000)),
        UInt64.fromUint(60), //officially 96h
        HashType.SHA3_512,
        secret,
        bobAccountPublic.address, // send to bob public
        NetworkType.MIJIN_TEST
    );

    // Alice sends TX1 to network (PUBLIC)
    const tx1Signed = aliceAccountPublic.sign(tx1);

    console.log('tx1Signed.hash   : ' + tx1Signed.hash);
    console.log('tx1Signed.signer : ' + tx1Signed.signer);

    // const transactionHttpPublic = new TransactionHttp('http://192.168.11.77:3000');

    transactionHttpPublic.announce(tx1Signed).subscribe(
        x => console.log(x),
        err => console.error(err)
    );
}, 1000);


setTimeout(() => {

    alisBobMosaicsAmountView();
    // Bob spends TX1 transaction by sending SecretProofTransaction (in PUBLIC network)
    // const bobPrivateKeyPublic = '31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E';
    // const bobAccountPublic = Account.createFromPrivateKey(bobPrivateKeyPublic, NetworkType.MIJIN_TEST);
    const tx4 = SecretProofTransaction.create(
        Deadline.create(),
        HashType.SHA3_512,
        secret,
        proof,
        NetworkType.MIJIN_TEST
    );

    const tx4Signed = aliceAccountPrivate.sign(tx4);

    console.log('tx4Signed.hash   : ' + tx4Signed.hash);
    console.log('tx4Signed.signer : ' + tx4Signed.signer);


        transactionHttpPublic.announce(tx4Signed).subscribe(
            x => console.log(x),
            err => console.error(err)
        )
},20000);




// ***************************************************
//             After
// ***************************************************
setTimeout(alisBobMosaicsAmountView, 35000);