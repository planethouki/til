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
    HashType = nem2Sdk.HashType,
    ModifyMultisigAccountTransaction = nem2Sdk.ModifyMultisigAccountTransaction,
    MultisigCosignatoryModificationType = nem2Sdk.MultisigCosignatoryModificationType,
    MultisigCosignatoryModification = nem2Sdk.MultisigCosignatoryModification;

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
carol:
  private: B332E3CA7B31D0BC663232B66D7C282BC2FE1DC0C01BB0159586A2CBEADD6B2A
  public: 543BB01DFEEA0D9A25ADDE515DACC72F2125A8AAE85EDD682D77251E2C4EC174
  address: SBDG7U6NY7MTNOXKVK2JFZDLK2KSCRFPXDZ7IC3Q
Multisig:
  private: E0BC90AA55A8D78A1DC8CE203A95C31A62E1EAF43D7BF94379709B79D90E0545
  public: 4CA83B9053C907AC7D9A5A0C26895489C8D07ADC57EF9AF1B8045775E0C91D31
  address: SBHAN5NVIMDZBYTYPBIHCZ5I5EZZO2WSGJ6PGKFI
*/


// ***************************************************
//             Creating Multisig Account
// ***************************************************


// Replace with the private key of the account that you want to convert into multisig
const privateKey = 'E0BC90AA55A8D78A1DC8CE203A95C31A62E1EAF43D7BF94379709B79D90E0545';

// Replace with cosignatories public keys
const cosignatory1PublicKey = '5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C';
const cosignatory2PublicKey = '3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57';

const account = Account.createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST);

const cosignatory1 = PublicAccount.createFromPublicKey(cosignatory1PublicKey, NetworkType.MIJIN_TEST);
const cosignatory2 = PublicAccount.createFromPublicKey(cosignatory2PublicKey, NetworkType.MIJIN_TEST);

const convertIntoMultisigTransaction = ModifyMultisigAccountTransaction.create(
    Deadline.create(),
    2,
    1,
    [
        new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Add,
            cosignatory1,
        ),
        new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Add,
            cosignatory2,
        )],
    NetworkType.MIJIN_TEST
);

const signedTransaction = account.sign(convertIntoMultisigTransaction);

const transactionHttp = new TransactionHttp('http://192.168.11.77:3000');

transactionHttp.announce(signedTransaction).subscribe(
    x => console.log(x),
    err => console.error(err)
);


console.log('signedTransaction.hash   : ' + signedTransaction.hash);
console.log('signedTransaction.signer : ' + signedTransaction.signer);

const accountHttp = new AccountHttp('http://192.168.11.77:3000');

// Replace with address
const address = 'SBHAN5NVIMDZBYTYPBIHCZ5I5EZZO2WSGJ6PGKFI';

setTimeout(() => {
    accountHttp.getMultisigAccountInfo(Address.createFromRawAddress(address)).subscribe(
        accountInfo => console.log(accountInfo),
        err => console.error(err)
    );
},20000);

