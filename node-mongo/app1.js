const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://54.178.241.129:27017';

// Database Name
const dbName = 'catapult';

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    findDocuments(db, () => {

        client.close();
    });

});

const findDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('transactions');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(JSON.stringify(docs[0]))
        callback(docs);
    });
}
