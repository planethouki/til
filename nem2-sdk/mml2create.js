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


/*
Member1:
  private: 7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4
  public: 5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C
  address: SBWEUWON6IBHCW5IC4EI6V6SMTVJGCJWGLF57UGK
Member2:
  private: 31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E
  public: 3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57
  address: SB2Y5ND4FDLBIO5KHXTKRWODDG2QHIN73DTYT2PC
Member3:
  private: B332E3CA7B31D0BC663232B66D7C282BC2FE1DC0C01BB0159586A2CBEADD6B2A
  public: 543BB01DFEEA0D9A25ADDE515DACC72F2125A8AAE85EDD682D77251E2C4EC174
  address: SBDG7U6NY7MTNOXKVK2JFZDLK2KSCRFPXDZ7IC3Q
Leader:
  address: SB2ZRIKJR2XN6RATAZOE2S7JLEYCVWPOPET45MWK
  public: 348F316AEE020F19EC9470B2819BC31F24A06D9C8F1D1648959F73293AEEF41D
  private: DD28C79DB50143CB0A4FB39E00AF1374E702D944A53E4384B64403052DA3CCB2
MultisigTeam:
  address: SANXEW2OMNYTH7KPF75CULSTNSIJCANALIVO5CQL
  public: 3F5CDB9C615D6A08D6BAFFF380B61F4FDEEBDEDB303547B36BC88BF3DB6E3541
  private: DAEA5FACA57EE1C5365C1B01DEA8B83014E23F1A27A7415A61B94462902D78B9

*/



const multisigTeamPrivateKey = 'DAEA5FACA57EE1C5365C1B01DEA8B83014E23F1A27A7415A61B94462902D78B9';

const leaderPublicKey = '348F316AEE020F19EC9470B2819BC31F24A06D9C8F1D1648959F73293AEEF41D';
const member1PublicKey = '5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C';
const member2PublicKey = '3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57';
const member3PublicKey = '543BB01DFEEA0D9A25ADDE515DACC72F2125A8AAE85EDD682D77251E2C4EC174';

const multisigTeamAccount = Account.createFromPrivateKey(multisigTeamPrivateKey, NetworkType.MIJIN_TEST);

const leader = PublicAccount.createFromPublicKey(leaderPublicKey, NetworkType.MIJIN_TEST);
const member1 = PublicAccount.createFromPublicKey(member1PublicKey, NetworkType.MIJIN_TEST);
const member2 = PublicAccount.createFromPublicKey(member2PublicKey, NetworkType.MIJIN_TEST);
const member3 = PublicAccount.createFromPublicKey(member3PublicKey, NetworkType.MIJIN_TEST);


const convertIntoMultisigTransaction = ModifyMultisigAccountTransaction.create(
    Deadline.create(),
    4,
    4,
    [
        new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Add,
            member1,
        ),
        new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Add,
            member2,
        ),
        new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Add,
            member3,
        ),
        new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Add,
            leader,
        ),
        new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Add,
            leader,
        )],
    NetworkType.MIJIN_TEST
);
const signedTransaction = multisigTeamAccount.sign(convertIntoMultisigTransaction);


const transactionHttp = new TransactionHttp('http://192.168.11.77:3000');

transactionHttp.announce(signedTransaction).subscribe(
    x => console.log(x),
    err => console.error(err)
);

console.log('signedTransaction.hash   : ' + signedTransaction.hash);



const accountHttp = new AccountHttp('http://192.168.11.77:3000');

const addressTeamMultisig = 'SANXEW2OMNYTH7KPF75CULSTNSIJCANALIVO5CQL';

setTimeout(() => {
    accountHttp.getMultisigAccountInfo(Address.createFromRawAddress(addressTeamMultisig)).subscribe(
        accountInfo => console.log(accountInfo),
        err => console.error(err)
    );
},20000);

