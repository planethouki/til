var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    assert = require('assert')
    ReadPreference = require('mongodb').ReadPreference;

const client = new MongoClient("mongodb://54.95.177.196:27617" , {
    readPreference: ReadPreference.PRIMARY,
    useNewUrlParser: true
});

  // Open the connection to the server
  client.connect(function(err, mongoclient) {

    // Get the first db and do an update document on it
    var db = mongoclient.db("catapult");
    
    const collection = db.collection('unconfirmedTransactions');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);
    });
    const changeStream = collection.watch();
    changeStream.on('change', next => {
        // process next document
        console.log("Found new record ==========================");
        console.log(next);
    });
    
    // mongoclient.close();
  });