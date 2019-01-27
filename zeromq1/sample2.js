// http://zguide.zeromq.org/js:wuclient

require('dotenv').config();
const host = process.env.HOST || 'tcp://127.0.0.1:3000';

// weather update client in node.js
// connects SUB socket to tcp://localhost:5556
// collects weather updates and finds avg temp in zipcode

var zmq = require('zeromq');

console.log("Collecting updates from weather server…");

// Socket to talk to server
var subscriber = zmq.socket('sub');

subscriber.connect(host);
subscriber.subscribe(Buffer.from("496aca80e4d8f29f", "hex"));

subscriber.on('message', function(topic, message) {
    console.log('received a message related to:', topic.toString('hex'), 'containing message:', message.toString('hex'));
});


