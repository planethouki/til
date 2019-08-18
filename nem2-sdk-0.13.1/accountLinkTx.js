const {
    Account,
    AccountLinkTransaction,
    Deadline,
    NetworkType,
    LinkAction,
    Mosaic,
    MosaicId,
    UInt64
 } = require('nem2-sdk')

 const remote = Account.generateNewAccount(NetworkType.MIJIN_TEST)
 const sender = Account.generateNewAccount(NetworkType.MIJIN_TEST)

const accountLinkTransaction = AccountLinkTransaction.create(
    Deadline.create(),
    remote.publicKey,
    LinkAction.Link,
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(20000)
)

const signedTransaction = sender.sign(accountLinkTransaction, '')
console.log(signedTransaction.payload)
console.log(sender.privateKey)
console.log(sender.publicKey)

// 99000000B0DC2A7C7F7B937ACBD4BCDFCD5B99CC559CD6DC222332A26444D43264AC03C2791140E8819FFF5F144E719B52AFE9BC14D005BBC46447DE8B95130A9DC8E0084A8C1D7461A982B6DB0A8F74191237CD43275AA20486A31D35FFB8DD9917B5A301904C41204E000000000000E4EF7CB118000000095684D7EC6251B49685E80096F2F7EA6DADF798541479758CED6A6E28C94DAB00
// 5F5F3572640CDF5651E1E55C006D3DC5E5D76A9BB21FB0AE963A7C49713A392A
// 4A8C1D7461A982B6DB0A8F74191237CD43275AA20486A31D35FFB8DD9917B5A3
