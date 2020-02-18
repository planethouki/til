import { Account, NetworkType } from 'nem2-sdk';

const newAccount = Account.generateNewAccount(NetworkType.TEST_NET);
console.log(newAccount.address.plain());