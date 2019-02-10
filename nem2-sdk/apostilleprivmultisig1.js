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
sender:
  private: 7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4
  public: 5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C
  address: SBWEUWON6IBHCW5IC4EI6V6SMTVJGCJWGLF57UGK
sink:
  address: SDICZ5EAOD5W6YCAJL33OS5B4Y6FUOWOUOOLCZAL
*/


const dedicatedPrivateKey = '7673d19743dcbb2344f84158f28f39754bce5b44a966043116c700d687cd75d6';
const ownerPublicKey = '5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C';

const dedicatedAccount = Account.createFromPrivateKey(dedicatedPrivateKey, NetworkType.MIJIN_TEST);
const cosignatory = PublicAccount.createFromPublicKey(ownerPublicKey, NetworkType.MIJIN_TEST);

const convertIntoMultisigTransaction = ModifyMultisigAccountTransaction.create(
    Deadline.create(),
    1,
    1,
    [
        new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Add,
            cosignatory,
        )
    ],
    NetworkType.MIJIN_TEST
);

const signedTransaction = dedicatedAccount.sign(convertIntoMultisigTransaction);

const transactionHttp = new TransactionHttp('http://192.168.11.77:3000');

// transactionHttp.announce(signedTransaction).subscribe(
//     x => console.log(x),
//     err => console.error(err)
// );


console.log('hash   : ' + signedTransaction.hash);
console.log('signer : ' + signedTransaction.signer);
console.log('payload: ' + signedTransaction.payload);

const accountHttp = new AccountHttp('http://192.168.11.77:3000');


setTimeout(() => {
    accountHttp.getMultisigAccountInfo(dedicatedAccount.address).subscribe(
        accountInfo => console.log(accountInfo),
        err => console.error(err)
    );
},20000);
