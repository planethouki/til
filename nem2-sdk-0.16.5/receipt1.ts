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
    // const statementType = '43e1';
    const statementType = '43f2';
    // const statemenetSource = '0000000000000000';
    const statemenetSource = 'eeaff441ba994be7';
    // const receipt0 = '01004321a84582052890a95139d2b80500000000c151a3a63e7aff6bdb78bf40e8a78c772ddb36e2306401771b0bfdcd4dd3b787';
    // const receipt1 = '01004351a84582052890a95139d2b80500000000';
    // const receipt0 = '01004321a84582052890a95100000000000000009be93593c699867f1b4f624fd37bc7fb93499cdec9929088f2ff1031293960ff';
    // const receipt1 = '';
    const receipt0 = '0500000000000000a84582052890a951';
    const receipt1 = '';

    const manualReceiptHash = hash(
        statementVersion +
        statementType +
        statemenetSource +
        receipt0 +
        receipt1
    );

    console.log(manualReceiptHash.toUpperCase());
    console.log(manualReceiptHash.toUpperCase() === receiptHash0);

    const receiptRoot = hash(
        '8EA9EEA135F10FECFA55ED908593C6A3D24E672F1259E9DA776554BF67E722F7' +
        'A91F73FBD1169356F3D9D83D86DCB9646356947BADDB18A46169B2C351E105A7'
    );

    console.log(receiptRoot.toUpperCase());

})()




function hash(hex) {
    const hasher = sha3_256.create();
    return hasher.update(Buffer.from(hex, 'hex')).hex();
}