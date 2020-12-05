const axios = require('axios');
const querystring = require('querystring');
const fs = require('fs');

const host = "http://go.nem.ninja:7890";
const path = "/account/transfers/incoming";
const address = "NAQ7RCYM4PRUAKA7AMBLN4NPBJEJMRCHHJYAVA72";

(async () => {

    let transactions = []

    let query = {
        address
    }

    for (let i = 0; i < 50; i++) {
    
        const data = await axios
            .get(`${host}${path}?${querystring.stringify(query)}`)
            .then(res => res.data.data)
            .catch((e) => {
                console.error(e);
                return null;
            });

        if (data === null) break;

        transactions.push(...data);

        const lastId = data[data.length - 1].meta.id;

        query.id = lastId;
    }

    fs.writeFileSync('./transaction1-1.json', JSON.stringify(transactions, null, '  '));
})();