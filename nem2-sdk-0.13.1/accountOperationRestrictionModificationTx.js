const {
    Account,
    AccountOperationRestrictionModificationTransaction,
    AccountRestrictionModification,
    AccountRestrictionTransaction,
    Deadline,
    NetworkType,
    RestrictionModificationType,
    RestrictionType,
    TransactionType,
    UInt64
 } = require('nem2-sdk')

const sender = Account.generateNewAccount(NetworkType.MIJIN_TEST)

const accountOperationRestrictionModificationTransaction = AccountOperationRestrictionModificationTransaction.create(
    Deadline.create(),
    0x44,
    [
        AccountRestrictionModification.createForOperation(
            RestrictionModificationType.add,
            TransactionType.TRANSFER
        )
    ],
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(20000)
)

const signedTransaction = sender.sign(accountOperationRestrictionModificationTransaction, '')
console.log(signedTransaction.payload)
console.log(sender.privateKey)
console.log(sender.publicKey)

// 7D000000D5541EE90CF41DF2DB104B0EA1EC25FEAA4485120C4EB4BB3AD77742AD3AE2BD546AF50A9B8B066F7D9A22869711826B48B8CB9A036DF32D4D4565BEB9D6310EC6C68D769B5470FE5EF07F98B634627CF9391B0388884D8B731EF58AE0D796BA01905043204E0000000000009DED78B1180000000401005441
// FED38FA09E2FA05E8E89B3E4C3FF38AB70090C5FC4421B9F109BE516F39C2EC9
// C6C68D769B5470FE5EF07F98B634627CF9391B0388884D8B731EF58AE0D796BA

// 7D0000008C44A99215DAF2023B09778D1D61988083DB2150C9FB6CBEEBF60BE74859C79E17EE19741CAD4694028088E21B422BA4B6FD955B12E5ED1B3A47D2031625BA0AC6A2EC2730821E34C653DAA1AC848AF66EC5AC58957E1C859AA5741FCADF8ED901905043204E00000000000075BECAD5180000004401005441
// 3D02D0DF059F5CB58C957401A0414CBE792CCB4568D2AA9921A49D4AF8E0542D
// C6A2EC2730821E34C653DAA1AC848AF66EC5AC58957E1C859AA5741FCADF8ED9

const accountRestrictionTransaction = AccountRestrictionTransaction
    .createOperationRestrictionModificationTransaction(
        Deadline.create(),
        RestrictionType.AllowTransaction,
        [
            AccountRestrictionModification.createForOperation(
                RestrictionModificationType.add,
                TransactionType.TRANSFER
            )
        ],
        NetworkType.MIJIN_TEST,
        UInt64.fromUint(20000)
    )

const signedTransaction2 = sender.sign(accountRestrictionTransaction, '')
console.log(signedTransaction2.payload)

// 7D0000007ED7268DE6D95D90C552DE066567D86AA4635DCCBF21FE96061D6EE3CCE3A95AB2742C32C450D8339EF090F40044988810C44D50C81F04F4A5A3E792C0363E09C6C68D769B5470FE5EF07F98B634627CF9391B0388884D8B731EF58AE0D796BA01905043204E000000000000B2ED78B1180000000401005441
