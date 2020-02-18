import {
    NetworkType,
    ReceiptHttp,
    UInt64
} from 'nem2-sdk';

import {sha3_256} from 'js-sha3';

(async () => {
    const receiptHttp = new ReceiptHttp(
        'https://jp5.nemesis.land:3001',
        NetworkType.TEST_NET
    );

    const statements = await receiptHttp.getBlockReceipts(UInt64.fromUint(2)).toPromise();
    const transactionStatements = statements.transactionStatements;
    const receiptHash0 = transactionStatements[0].generateHash();
    console.log(receiptHash0);

    const statementVersion = '0100';
    const statementType = '43e1';
    const statemenetSource = '0000000000000000';
    const receipt0 = '01004321a84582052890a95139d2b80500000000c151a3a63e7aff6bdb78bf40e8a78c772ddb36e2306401771b0bfdcd4dd3b787';
    const receipt1 = '01004351a84582052890a95139d2b80500000000';

    const manualReceiptHash = hash(
        statementVersion +
        statementType +
        statemenetSource +
        receipt0 +
        receipt1
    );

    console.log(manualReceiptHash);
    console.log(manualReceiptHash.toUpperCase() === receiptHash0);

})()

function hash(hex) {
    const hasher = sha3_256.create();
    return hasher.update(Buffer.from(hex, 'hex')).hex();
}