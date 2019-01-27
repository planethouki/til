// https://github.com/zeromq/zeromq.js

var zmq = require('zeromq')
    , sock = zmq.socket('pull');

require('dotenv').config();

const host = process.env.HOST || 'tcp://127.0.0.1:3000';

sock.connect(host);
console.log('Worker connected to ' + host);

sock.on('message', function(msg){
    console.log('work: %s', msg.toString());
});

sock.on('error', function(err) {
    console.log('error');
    console.log(err.toString('utf8'));
});