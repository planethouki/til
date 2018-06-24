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

/* 3100 network (Private)
Alice:
  private: 8CBA73B9DF31D85DCFA4B9E1D3B7A88E5A5F32C930FCC45FE5A457619F3E6687
  public: C36F5BDDE8B2B586D17A4E6F4B999DD36EBD114023C1231E38ABCB1976B938C0
  address: SBNRDTMZ3MF4RFNQA2ZA33G74EGTINCKX2EHYYHY
Bob:
  private: BA46F91D7BCD40B6482E138F0D3D53A29F0A6097B5C4586C6ABD81A3BA3A2DAD
  public: 1C650F49DD67EC50BFDEA40906D32CDE3C969BDF58837C7DA320829BDDE96150
  address: SCBCMLVDJBXARCOI6XSKEU3ER2L6HH7UBEPTENGQ
command:
  - nem2-cli profile create -p 8CBA73B9DF31D85DCFA4B9E1D3B7A88E5A5F32C930FCC45FE5A457619F3E6687 -n MIJIN_TEST -u http://192.168.11.77:3100 --profile alice31
  - nem2-cli profile create -p BA46F91D7BCD40B6482E138F0D3D53A29F0A6097B5C4586C6ABD81A3BA3A2DAD -n MIJIN_TEST -u http://192.168.11.77:3100 --profile bob31
*/



const alicePrivateKeyPrivate = '8CBA73B9DF31D85DCFA4B9E1D3B7A88E5A5F32C930FCC45FE5A457619F3E6687';
const aliceAccountPrivate = Account.createFromPrivateKey(alicePrivateKeyPrivate, NetworkType.MIJIN_TEST);
const alicePrivateKeyPublic = '7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4';
const aliceAccountPublic = Account.createFromPrivateKey(alicePrivateKeyPublic, NetworkType.MIJIN_TEST);

const bobPrivateKeyPrivate = 'BA46F91D7BCD40B6482E138F0D3D53A29F0A6097B5C4586C6ABD81A3BA3A2DAD';
const bobAccountPrivate = Account.createFromPrivateKey(bobPrivateKeyPrivate, NetworkType.MIJIN_TEST);
const bobPrivateKeyPublic = '31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E';
const bobAccountPublic = Account.createFromPrivateKey(bobPrivateKeyPublic, NetworkType.MIJIN_TEST);


const urlPublic = 'http://192.168.11.77:3000';
const urlPrivate = 'http://192.168.11.77:3100';


const transactionHttpPublic = new TransactionHttp(urlPublic);
const accountHttpPublic = new AccountHttp(urlPublic);
const mosaicHttpPublic = new MosaicHttp(urlPublic);
const namespaceHttpPublic = new NamespaceHttp(urlPublic);
const mosaicServicePublic = new MosaicService(accountHttpPublic, mosaicHttpPublic, namespaceHttpPublic);

const transactionHttpPrivate = new TransactionHttp(urlPrivate);
const accountHttpPrivate = new AccountHttp(urlPrivate);
const mosaicHttpPrivate = new MosaicHttp(urlPrivate);
const namespaceHttpPrivate = new NamespaceHttp(urlPrivate);
const mosaicServicePrivate = new MosaicService(accountHttpPrivate, mosaicHttpPrivate, namespaceHttpPrivate);

const alisBobMosaicsAmountView = () => {
  const mosaicsAmountViewFromAddress = (logPrefix, mosaicService, address) => {
      mosaicService.mosaicsAmountViewFromAddress(address)
          .flatMap((_) => _)
          .subscribe(
              mosaic => console.log(logPrefix, mosaic.relativeAmount(), mosaic.fullName()),
              err => console.error(err)
          );
  };
  const timestamp = new Date().getTime();
  mosaicsAmountViewFromAddress('[' + timestamp + '] Alice(Public) have', mosaicServicePublic, aliceAccountPublic.address);
  mosaicsAmountViewFromAddress('[' + timestamp + '] Alice(Private) have', mosaicServicePrivate, aliceAccountPrivate.address);
  mosaicsAmountViewFromAddress('[' + timestamp + '] Bob(Public) have', mosaicServicePublic, bobAccountPublic.address);
  mosaicsAmountViewFromAddress('[' + timestamp + '] Bob(Private) have', mosaicServicePrivate, bobAccountPrivate.address);
};

alisBobMosaicsAmountView();
