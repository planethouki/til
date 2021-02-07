require('dotenv').config();
const axios = require('axios');

const {
    API_URL_PREFIX,
    SERVICE_KEY,
} = process.env;
const webhookEvent = "webhook_test";

const url = `${API_URL_PREFIX}/trigger/${webhookEvent}/with/key/${SERVICE_KEY}`;
const data = {
    value1: "テスト"
};
const config = {};

axios.post(url, data, config).then((res) => {
    console.log(res.data);
})