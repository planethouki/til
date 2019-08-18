const {
    Account,
    Deadline,
    NetworkType,
    ModifyMultisigAccountTransaction,
    MultisigCosignatoryModification,
    MultisigCosignatoryModificationType,
    UInt64
 } = require('nem2-sdk')

const sender = Account.generateNewAccount(NetworkType.MIJIN_TEST)
const cosignatory1 = Account.generateNewAccount(NetworkType.MIJIN_TEST)
const cosignatory2 = Account.generateNewAccount(NetworkType.MIJIN_TEST)
const cosignatory3 = Account.generateNewAccount(NetworkType.MIJIN_TEST)

const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
    Deadline.create(),
    2,
    2,
    [
        new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Add,
            cosignatory1.publicAccount,
        ),
        new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Add,
            cosignatory2.publicAccount,
        ),
        new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Add,
            cosignatory3.publicAccount,
        )
    ],
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(20000)
)

const signedTransaction = sender.sign(modifyMultisigAccountTransaction, '')
console.log(signedTransaction.payload)
console.log(sender.privateKey)
console.log(sender.publicKey)

// DE00000046BAC28BD682C6F88E313F1F1B3D7BF89A37FE6538DB60E9D927078A82A80332520085EC453E8876A3674911C435608CDF88B05C46F4B614CC563D32C1489C092027CC102997B7E77D2347E4732E240762D0A7A522CAD16104147BEEFC3B2EF601905541204E000000000000DC0F12B01800000002020300439EEE6EB9B40BACF37EA777D3BCDB59B5E2B0DA06252C8FA83079B0F1FE6BB900857B4512E1C7B82616922D72476F339D2B5212D1D11DE3AEF8C957F40C4A759F00FE9B2CB397EDB0E382AFFFC5AC7225ECDE6589A20480BE2A1B269705257D4B74
// 55BBFF7ACB77A5EB77F3AC6320F8BA620B7647CC4E000136D6842739893B740A
// 2027CC102997B7E77D2347E4732E240762D0A7A522CAD16104147BEEFC3B2EF6