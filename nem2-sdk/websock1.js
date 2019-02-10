const nem2Sdk = require("nem2-sdk");
const crypto = require("crypto")
const jssha3 = require('js-sha3')
const sha3_512 = jssha3.sha3_512
const rx = require('rxjs')
const op = require('rxjs/operators')

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
    MultisigCosignatoryModification = nem2Sdk.MultisigCosignatoryModification,
    TransactionType = nem2Sdk.TransactionType;


/*
Ticket:
  private: 084513BEA4F01EECC15AEC65122BB4D3E70CA3670EC776C593BE949DFF712B21
  public: CC9E167E28CA4227F5C461BF40AEC60EFB98E200C998F86BEBCD68D4FC66D993
  address: SAJC2DOC76EATVJF65KE6U2TVGIN3FNQZRJOEWNZ
Alice:
  private: FC4A39AE6E17DAE2F72440DB93BF76C3C6C1684735FD8501BD87BCDCAD1E6D8C
  public: A86F31C436489485C6CE91DECAAF7546BC289093BBB23EE5DD975462B072D134
  address: SAGR32KYXS2Y65J3XTI53VI4F4EURKFQNPKX56XT
*/


const alicePrivateKey = 'FC4A39AE6E17DAE2F72440DB93BF76C3C6C1684735FD8501BD87BCDCAD1E6D8C';
const aliceAccount = Account.createFromPrivateKey(alicePrivateKey, NetworkType.MIJIN_TEST);

const ticketDistributorPublicKey = 'CC9E167E28CA4227F5C461BF40AEC60EFB98E200C998F86BEBCD68D4FC66D993';
const ticketDistributorPublicAccount = PublicAccount.createFromPublicKey( ticketDistributorPublicKey, NetworkType.MIJIN_TEST);


const ticketDistributorPrivateKey = '084513BEA4F01EECC15AEC65122BB4D3E70CA3670EC776C593BE949DFF712B21';
const ticketDistributorAccount = Account.createFromPrivateKey(ticketDistributorPrivateKey, NetworkType.MIJIN_TEST);



const url = 'http://localhost:3000'

const close = (listener) => {
    listener.close();
}

let listeners = [];

for (let i = 0; i < 1000; i++){

    listeners.push(new Listener(url));

    listeners[i].open().then(() => {
        
        listeners[i].confirmed(aliceAccount.address)
        .subscribe(
            x => console.log(x),
            err => console.error(err)
        );
        
        listeners[i].unconfirmedAdded(aliceAccount.address)
        .subscribe(
            x => console.log(x),
            err => console.error(err)
        );

        listeners[i].unconfirmedRemoved(aliceAccount.address)
        .subscribe(
            x => console.log(x),
            err => console.error(err)
        );

        listeners[i].status(aliceAccount.address)
        .subscribe(
            x => console.log(x),
            err => console.error(err)
        );

        setTimeout(close, 1000*60*60*24, listeners[i]);

    })

}