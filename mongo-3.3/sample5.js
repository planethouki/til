const MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    assert = require('assert');

const client = new MongoClient('mongodb://localhost:27617' , {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

client.connect(function(err, mongoclient) {
    assert.equal(err, null);
    console.log('connection open');

    const db = mongoclient.db('catapult');
    
    const collection = db.collection('unconfirmedTransactions');
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log('Found the following records');
        console.log(docs);
    });

    const pipeline = [{
        $match: {
            operationType: 'insert'
        }
    }]

    const changeStream = collection.watch(pipeline);
    changeStream.on('change', next => {
        console.log('Found new record');
        const dateStr = ObjectId(next.fullDocument._id).getTimestamp();
        const hash = next.fullDocument.meta.hash.buffer.toString('hex').toUpperCase();
        console.log(dateStr, hash);
    });
    
    process.on('SIGINT', () => {
        mongoclient.close();
        console.log('connection close');
        process.exit(0);
    })
});