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
MultisigMember:
  address: SD44XSFSUA4VFJ7WDUNOXYZMLO2KI3V4MM4UKV3E
  public: EBF690A57336D91627CDC698A075DA3D2254357AA8E17B727CC5F7ED644258B6
  private: 8F8AFE796D16A642234BE5130E5E5ABD899C37346A0F3A1834A064589333BB3F
MultisigTeam:
  address: SBTRGZ6NFKH5DGTN4DROSX35GGGL5WB22RZELVCL
  public: 86483CAF5AA77935A4C59201A1B0C0B3FD5EAF12EC78A8221D7BEF3ABB4F9B29
  private: 6CD836AA14C5FB5820E39F0AB420BD0BB6D506855F95D8DA233EFE93D590B89F

*/



const multisigMemberPrivateKey = '8F8AFE796D16A642234BE5130E5E5ABD899C37346A0F3A1834A064589333BB3F';

const member1PublicKey = '5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C';
const member2PublicKey = '3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57';
const member3PublicKey = '543BB01DFEEA0D9A25ADDE515DACC72F2125A8AAE85EDD682D77251E2C4EC174';

const multisigMemberAccount = Account.createFromPrivateKey(multisigMemberPrivateKey, NetworkType.MIJIN_TEST);

const member1 = PublicAccount.createFromPublicKey(member1PublicKey, NetworkType.MIJIN_TEST);
const member2 = PublicAccount.createFromPublicKey(member2PublicKey, NetworkType.MIJIN_TEST);
const member3 = PublicAccount.createFromPublicKey(member3PublicKey, NetworkType.MIJIN_TEST);

const convertIntoMultisigTransaction1 = ModifyMultisigAccountTransaction.create(
    Deadline.create(),
    2,
    2,
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
        )],
    NetworkType.MIJIN_TEST
);
const signedTransaction1 = multisigMemberAccount.sign(convertIntoMultisigTransaction1);


const multisigTeamPrivateKey = '6CD836AA14C5FB5820E39F0AB420BD0BB6D506855F95D8DA233EFE93D590B89F';

const leaderPublicKey = '348F316AEE020F19EC9470B2819BC31F24A06D9C8F1D1648959F73293AEEF41D';

const multisigTeamAccount = Account.createFromPrivateKey(multisigTeamPrivateKey, NetworkType.MIJIN_TEST);

const leader = PublicAccount.createFromPublicKey(leaderPublicKey, NetworkType.MIJIN_TEST);

const convertIntoMultisigTransaction2 = ModifyMultisigAccountTransaction.create(
    Deadline.create(),
    2,
    1,
    [
        new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Add,
            leader,
        ),
        new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Add,
            multisigMemberAccount.publicAccount,
        )],
    NetworkType.MIJIN_TEST
);
const signedTransaction2 = multisigTeamAccount.sign(convertIntoMultisigTransaction2);





const transactionHttp = new TransactionHttp('http://192.168.11.77:3000');

transactionHttp.announce(signedTransaction1).subscribe(
    x => console.log(x),
    err => console.error(err)
);

transactionHttp.announce(signedTransaction2).subscribe(
    x => console.log(x),
    err => console.error(err)
);

console.log('signedTransaction1.hash   : ' + signedTransaction1.hash);
console.log('signedTransaction2.hash   : ' + signedTransaction2.hash);



const accountHttp = new AccountHttp('http://192.168.11.77:3000');

const addressMemberMultisig = 'SD44XSFSUA4VFJ7WDUNOXYZMLO2KI3V4MM4UKV3E';
const addressTeamMultisig = 'SBTRGZ6NFKH5DGTN4DROSX35GGGL5WB22RZELVCL';

setTimeout(() => {
    accountHttp.getMultisigAccountInfo(Address.createFromRawAddress(addressMemberMultisig)).subscribe(
        accountInfo => console.log(accountInfo),
        err => console.error(err)
    );
    accountHttp.getMultisigAccountInfo(Address.createFromRawAddress(addressTeamMultisig)).subscribe(
        accountInfo => console.log(accountInfo),
        err => console.error(err)
    );
},20000);

