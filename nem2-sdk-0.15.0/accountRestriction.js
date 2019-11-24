process.env.END_POINT = 'http://54.65.82.119:3000';
process.env.GENERATION_HASH = '7FA4591C53AFF8678E27786C546AF10955C15C98FCA9D1043F7F6728CCB8D14E';
process.env.PRIVATE_KEY = '11071725513DDA9FCF9C251910E0F4EE6362EBB1B648163CBC5D7E8721B5B19D';

const { Account, Deadline, UInt64, AccountRestrictionFlags, TransactionHttp,
    AccountRestrictionModificationAction, AccountRestrictionModification,
    AccountAddressRestrictionTransaction, NetworkType } = require('nem2-sdk');

const account = Account.createFromPrivateKey(process.env.PRIVATE_KEY, NetworkType.MIJIN_TEST);
const endpoint = process.env.END_POINT;
const accountAddressRestrictionTransaction = AccountAddressRestrictionTransaction.create(
    Deadline.create(),
    AccountRestrictionFlags.AllowIncomingAddress,
    [Account.generateNewAccount(NetworkType.MIJIN_TEST).address],
    [],
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(30000)
);
const signedTx = account.sign(accountAddressRestrictionTransaction, process.env.GENERATION_HASH);
const txHttp = new TransactionHttp(endpoint);
txHttp.announce(signedTx).subscribe(console.log, console.error);
