const {
    Account,
    Address,
    Deadline,
    NetworkType,
    PlainMessage,
    Mosaic,
    MosaicId,
    TransferTransaction,
    UInt64
 } = require('nem2-sdk')

 const recipient = Account.generateNewAccount(NetworkType.MIJIN_TEST)
 const sender = Account.generateNewAccount(NetworkType.MIJIN_TEST)

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    recipient.address,
    [new Mosaic(new MosaicId('77A1969932D987D7'), UInt64.fromUint(1000000))],
    new PlainMessage(''),
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(20000)
)

const signedTransaction = sender.sign(transferTransaction, '')
console.log(signedTransaction.payload)
console.log(recipient.address.plain())
console.log(sender.privateKey)
console.log(sender.publicKey)



// A50000001D222BCC96CB8F2E677D12AA286CBB6C8CC796023F5D69A477BA013BD270F4A9252D7DF3085C238651FE152BF9025692654CCD7E47199A4ABB319117F767AA069A234CFEE354D683C6F225818D78C94CD2BC80A1380A02D9A354DD42BED6E60701905441204E000000000000F47791A61800000090866E1A131457ECF172889717CA9F846CD1F81A04A4AC067901000100D787D9329996A17740420F0000000000
// SCDG4GQTCRL6Z4LSRCLRPSU7QRWND6A2ASSKYBTZ
// ACB036729507AB7D7D64BF69C900EA77DD927229A1A63D70A57D7CF4543B48AC
// 9A234CFEE354D683C6F225818D78C94CD2BC80A1380A02D9A354DD42BED6E607