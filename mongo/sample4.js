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

    const findDocuments = function(db, callback) {
        // Get the documents collection
        const collection = db.collection('unconfirmedTransactions');
        // Find some documents
        collection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following records");
            // console.log(docs);
            callback(docs);
        });
    };

    findDocuments(db, function(docs) {
        docs.map(doc => {
            console.log(`hash=${doc.meta.hash.buffer.toString('hex').toUpperCase()} signer=${doc.transaction.signer.buffer.toString('hex').toUpperCase()}`);
        });
    });

    client.close();
});