const fs = require('fs');

const find = 8;

const file = fs.readFileSync('./transaction1-1.json');
const data = JSON.parse(file);

data
    .filter((tx) => {
        const message = tx.transaction.message.payload;
        const messageText = Buffer.from(message, 'hex').toString();
        try {
            const msgData = JSON.parse(messageText);
            return msgData.type === find;
        } catch(e) {
            return false;
        }
    })
    .forEach((tx) => {
        console.log(tx.meta.hash.data);
    });
