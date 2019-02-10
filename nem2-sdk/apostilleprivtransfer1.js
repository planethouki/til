const nem2Sdk = require("nem2-sdk");
const cryptoJS = require("crypto-js");
const jssha3 = require('js-sha3');
const nem2lib = require("nem2-library");

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
    HashType = nem2Sdk.HashType,
    ModifyMultisigAccountTransaction = nem2Sdk.ModifyMultisigAccountTransaction,
    MultisigCosignatoryModificationType = nem2Sdk.MultisigCosignatoryModificationType,
    MultisigCosignatoryModification = nem2Sdk.MultisigCosignatoryModification;

const sha3_512 = jssha3.sha3_512;


/*
owner:
  private: 7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4
  public: 5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C
  address: SBWEUWON6IBHCW5IC4EI6V6SMTVJGCJWGLF57UGK
newowner:
  private: 31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E
  public: 3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57
  address: SB2Y5ND4FDLBIO5KHXTKRWODDG2QHIN73DTYT2PC
dedicated:
  private: 7673d19743dcbb2344f84158f28f39754bce5b44a966043116c700d687cd75d6
  public: B2762457C2373191C83018E9C4B556C24C44D857003A795CEE1550EB9593012C
  address: SDVVQU67YDYEJQITBAUFA5QXRNYPXOVER6Z47MZH
*/


const dedicatedPublicKey = 'B2762457C2373191C83018E9C4B556C24C44D857003A795CEE1550EB9593012C';
const ownerPrivateKey = '7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4';
const newownerPublicKey = '3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57';

const dedicatedAccount = PublicAccount.createFromPublicKey(dedicatedPublicKey, NetworkType.MIJIN_TEST);
const ownerAccount = Account.createFromPrivateKey(ownerPrivateKey, NetworkType.MIJIN_TEST);
const newownerAccount = PublicAccount.createFromPublicKey(newownerPublicKey, NetworkType.MIJIN_TEST);

const changeOwnershipTransaction = ModifyMultisigAccountTransaction.create(
    Deadline.create(),
    0,
    0,
    [
        new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Add,
            newownerAccount
        ),
        new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Remove,
            ownerAccount.publicAccount
        )
    ],
    NetworkType.MIJIN_TEST
);

const aggregateTransaction = AggregateTransaction.createComplete(
    Deadline.create(),
    [
        changeOwnershipTransaction.toAggregate(dedicatedAccount),
    ],
    NetworkType.MIJIN_TEST,
    []
);
const signedTransaction = ownerAccount.sign(aggregateTransaction);

console.log('hash   : ' + signedTransaction.hash);
console.log('signer : ' + signedTransaction.signer);
console.log('payload: ' + signedTransaction.payload);

const transactionHttp = new TransactionHttp('http://192.168.11.77:3000');

transactionHttp.announce(signedTransaction).subscribe(
    x => console.log(x),
    err => console.error(err)
);

const accountHttp = new AccountHttp('http://192.168.11.77:3000');

setTimeout(() => {
    accountHttp.getMultisigAccountInfo(dedicatedAccount.address).subscribe(
        accountInfo => console.log(accountInfo),
        err => console.error(err)
    );
},20000);