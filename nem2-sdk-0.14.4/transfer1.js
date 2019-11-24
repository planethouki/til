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

process.env.END_POINT = 'http://fushicho2.48gh23s.xyz:3000';
process.env.NETWORK_GENERATION_HASH = '8D2F8F41FF5C92F9B667C9ABFF1F516AD2DAE9E8D256C0A7C5BF631E9181CACB';
process.env.PRIVATE_KEY = '09DD19B7C62EA726A847DECDA1A491B29E51F1720629B168DA163315262720C4';

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
const recipientAddress = Address.createFromRawAddress('SD5DT3-CH4BLA-BL5HIM-EKP2TA-PUKF4N-Y3L5HR-IR54');

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    recipientAddress,
    [NetworkCurrencyMosaic.createRelative(10)],
    PlainMessage.create('Welcome To NEM'),
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(20000));
/* end block 01 */

/* start block 02 */
const privateKey = process.env.PRIVATE_KEY;
const account = Account.createFromPrivateKey(privateKey,NetworkType.MIJIN_TEST);
const networkGenerationHash = process.env.NETWORK_GENERATION_HASH;

const signedTransaction = account.sign(transferTransaction, networkGenerationHash);
/* end block 02 */

/* start block 03 */
const transactionHttp = new TransactionHttp(process.env.END_POINT);
transactionHttp
    .announce(signedTransaction)
    .subscribe(x => console.log(x), err => console.error(err));
/* end block 03 */

console.log(signedTransaction.payload);
console.log(signedTransaction.hash);