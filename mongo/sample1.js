const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
require('dotenv').config();

// Connection URL
const url = process.env.DB_HOST || 'mongodb://localhost:27017';

// Database Name
const dbName = 'catapult';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    client.close();
});