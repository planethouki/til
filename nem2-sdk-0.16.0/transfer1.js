/*
 *
 * Copyright 2018-present NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

process.env.END_POINT = 'http://54.65.82.119:3000';
process.env.NETWORK_GENERATION_HASH = '4DE8BC90BF62CC3F300F502A0711AAB4877867654349AAC36DD277CC50A77AEF';
process.env.PRIVATE_KEY = 'C42A4DC67C28AF06EE5294584A6CB666F11DF3BE2F378F994BCCA3860B865507';

const {
    Account,
    Address,
    Deadline,
    NetworkType,
    PlainMessage,
    TransactionHttp,
    TransferTransaction,
    UInt64,
    NetworkCurrencyMosaic,
} = require('nem2-sdk');

/* start block 01 */
const recipientAddress = Account.generateNewAccount(NetworkType.TEST_NET).address;

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    recipientAddress,
    [NetworkCurrencyMosaic.createRelative(10)],
    PlainMessage.create('Welcome To NEM'),
    NetworkType.TEST_NET,
    UInt64.fromUint(20000));
/* end block 01 */

/* start block 02 */
const privateKey = process.env.PRIVATE_KEY;
const account = Account.createFromPrivateKey(privateKey,NetworkType.TEST_NET);
const networkGenerationHash = process.env.NETWORK_GENERATION_HASH;

const signedTransaction = account.sign(transferTransaction, networkGenerationHash);
/* end block 02 */

/* start block 03 */
const transactionHttp = new TransactionHttp(process.env.END_POINT);
// transactionHttp
//     .announce(signedTransaction)
//     .subscribe(x => console.log(x), err => console.error(err));
/* end block 03 */

console.log(signedTransaction.payload);
console.log(signedTransaction.hash);
