const {
    Account,
    AccountAddressRestrictionModificationTransaction,
    AccountRestrictionModification,
    AccountRestrictionTransaction,
    Deadline,
    NetworkType,
    RestrictionModificationType,
    RestrictionType,
    UInt64
 } = require('nem2-sdk')

const recipient = Account.generateNewAccount(NetworkType.MIJIN_TEST)
const sender = Account.generateNewAccount(NetworkType.MIJIN_TEST)

const accountAddressRestrictionModificationTransaction = AccountAddressRestrictionModificationTransaction.create(
    Deadline.create(),
    RestrictionType.AllowAddress,
    [
        AccountRestrictionModification.createForAddress(
            RestrictionModificationType.add,
            recipient.address
        )
    ],
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(20000)
)

const signedTransaction = sender.sign(accountAddressRestrictionModificationTransaction, '')
console.log(signedTransaction.payload)
console.log(recipient.address.plain())
console.log(sender.privateKey)
console.log(sender.publicKey)

// 940000001C4780A6B712A63248D9DD991767BE40F402B4B631883D673F52426C885A0562AB4F51AF32EA10F92C72D910EE1394AC7BFD383C359FE23BD2D4A9CEC458150F7E008465491CC27A14B768AF20F19224590871B1244B2AC5E00815AF6AE91F7A01905041204E00000000000095344AB11800000001010090C55DE77EA74411C54065CD9A0CA0EF0E1C90A82CE5713355
// SDCV3Z36U5CBDRKAMXGZUDFA54HBZEFIFTSXCM2V
// E8A33E5EB2F309479E751FA99948D7927BEADE4C64870455FAE72F43F555C563
// 7E008465491CC27A14B768AF20F19224590871B1244B2AC5E00815AF6AE91F7A

const accountRestrictionTransaction = AccountRestrictionTransaction
    .createAddressRestrictionModificationTransaction(
        Deadline.create(),
        RestrictionType.AllowAddress,
        [
            AccountRestrictionModification.createForAddress(RestrictionModificationType.add, recipient.address)
        ],
        NetworkType.MIJIN_TEST,
        UInt64.fromUint(20000)
    )

const signedTransaction2 = sender.sign(accountRestrictionTransaction, '')
console.log(signedTransaction2.payload)

// 94000000F1F9A67DCBE990A441CCDF4C24BC5D674DC617C83044DE5EF79026369D97832AB32DE220172927A090279AE78C4C35D87480F68621AD50486ED405195FF1210C7E008465491CC27A14B768AF20F19224590871B1244B2AC5E00815AF6AE91F7A01905041204E000000000000A6344AB11800000001010090C55DE77EA74411C54065CD9A0CA0EF0E1C90A82CE5713355