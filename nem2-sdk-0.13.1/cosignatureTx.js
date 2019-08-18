const {
    Account,
    AggregateTransaction,
    CosignatureTransaction,
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
 const initiator = Account.generateNewAccount(NetworkType.MIJIN_TEST)

 const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    recipient.address,
    [new Mosaic(new MosaicId('77A1969932D987D7'), UInt64.fromUint(1000000))],
    new PlainMessage(''),
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(20000)
)

const aggregateTransaction = AggregateTransaction.createBonded(
    Deadline.create(),
    [
        transferTransaction.toAggregate(sender.publicAccount)
    ],
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(20000)
)

const signedTransaction = sender.sign(aggregateTransaction, '')

aggregateTransaction.transactionInfo = {
    hash: signedTransaction.hash
}

const cosignatureTransaction = CosignatureTransaction.create(
    aggregateTransaction
)


const cosignatureSignedTransaction = sender.signCosignatureTransaction(cosignatureTransaction, '')
console.log(cosignatureSignedTransaction.parentHash)
console.log(cosignatureSignedTransaction.signature)
console.log(cosignatureSignedTransaction.signer)
console.log(sender.privateKey)
console.log(sender.publicKey)

// A628C2032547699EE8A6818D468AF0EB3E44C97554314087279860B057E18DDE
// 721B02D3653C2C4D37AC97FDDF789412DF428E7B299A50D4B9BBF33FE8E9D889AFC162F7A267D2AB6827034A0B5A2724ED271554F12EAC4A63E3E3D45503E205
// CB5EEC6C28AD2018CE5D56559DC1113B174ED16DCC1D70781E16EF190AFAECF0
// EFFE4C21364020BF1126952CAC3A8ACCA3D96087246463F397ACC6C05C4B4992
// CB5EEC6C28AD2018CE5D56559DC1113B174ED16DCC1D70781E16EF190AFAECF0