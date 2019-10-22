const restify = require('restify');
const mongoose = require('mongoose');

const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

mongoose.connect('mongodb://54.249.6.119:27617/catapult', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const MosaicSchema = new Schema({
    _id: ObjectId,
    mosaic: {
        id: String,
        supply: Number,
        ownerPublicKey: Buffer
    }
});

mongoose.model('Mosaic', MosaicSchema);
const Mosaic = mongoose.model('Mosaic');

// This function is responsible for returning all entries for the Message model
function getMessages(req, res, next) {
    // Resitify currently has a bug which doesn't allow you to set default headers
    // This headers comply with CORS and allow us to server our response to any origin
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // .find() without any arguments, will return all results
    // the `-1` in .sort() means descending order
    Mosaic.find(function (err, mosaics) {
        if (err) return console.error(err);
        const fmtMosaics = mosaics.map((m) => {
            return {
                ...m.mosaic
            }
        })
        res.send(fmtMosaics.slice(0, 3));
    });

}

server.get('/mosaic', getMessages);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});