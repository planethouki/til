require('dotenv').config();
const axios = require('axios');
const parse = require('csv-parse/lib/sync');

const {
    API_URL_PREFIX,
    SERVICE_KEY,
    WEBHOOK_EVENT: webhookEvent,
    CSV_URL,
    IMAGE_URL
} = process.env;

async function main() {

    const input = await axios.get(CSV_URL).then(res => res.data);
    const records = parse(input, {
        columns: true,
        skip_empty_lines: true
    });

    console.log(records);
    
    const found = records.find((item) => {
        return item.date === "210213";
    });

    if (found === undefined) {
        console.log("not found");
    } else {
        console.log(found);
    }

    return;

    const url = `${API_URL_PREFIX}/trigger/${webhookEvent}/with/key/${SERVICE_KEY}`;
    const data = {
        value1: "テスト",
        value2: "#料理",
        value3: `${IMAGE_URL}`
    };
    const config = {};
    
    await axios.post(url, data, config).then((res) => {
        console.log(res.data);
    })

}

main();