const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});


const nem = require('nem-sdk').default;
const request = require('request');

var address = process.env.NEM_ADDRESS;
if (!nem.model.address.isValid(address)) {
  throw "address invalid: "+ address;
};
var node = address.charAt() == "N" ? nem.model.nodes.defaultMainnet : nem.model.nodes.defaultTestnet;
var endpoint = nem.model.objects.create("endpoint")(node, nem.model.nodes.defaultPort);

var lastValue = 0;
var lastUnconfirmedTx = [];

var url = 'https://maker.ifttt.com/trigger/'+process.env.IFTTT_EVENT_NAME+'/with/key/'+process.env.IFTTT_KEY;

process.on('unhandledRejection', console.dir);

setInterval(function loop() {

  nem.com.requests.account.mosaics.owned(endpoint, address).then( (accountData) => {
    var value = accountData
      .data
      .filter(
          mosaic => mosaic.mosaicId.namespaceId == "nem"
          && mosaic.mosaicId.name == "xem"
        )
      .pop().quantity;
    if (value != lastValue && lastValue != 0) {
      //$('#stream').prepend('<p>'+date.toLocaleString()+': '+value'</p>');
      var fmtLastValue = nem.utils.format.nemValue(lastValue);
      var fmtValue = nem.utils.format.nemValue(value);
      var fmtActivity = fmtLastValue[0]+'.'+fmtLastValue[1]+' -> '+fmtValue[0]+'.'+fmtValue[1];
      postifttt(fmtActivity);
      sendclient(fmtActivity);
    } else {
      console.log('No Value activity');
    };
    lastValue = value;
  }, (err) => {
    console.log(err);
  });

  nem.com.requests.account.transactions.unconfirmed(endpoint, address).then( (txsData) => {
    if ( txsData.data.length > 0 ) {
      var value = txsData
        .data
        .filter((tx) => {
          var findResult = lastUnconfirmedTx.find((lastTx) => {
            return JSON.stringify(tx) == JSON.stringify(lastTx);
          });
          return findResult === undefined;
        })
        .map((tx) => {
          postifttt(JSON.stringify(tx));
          sendclient(JSON.stringify(tx));
        })
    } else {
      console.log('No unconfirmed transactions');
    }
    lastUnconfirmedTx = txsData.data;
  }, (err) => {
    console.log(err);
  });
  sendclient('heatbeat');
}, 10000);

function postifttt(value) {
  console.log('Post IFTTT: '+value)
  request.post({
    "url": url,
    "headers": {
      "content-type": "application/json"
    },
    body: JSON.stringify({"value1": value})
  }, function(err, res, body) {
    //console.log(err);
    //console.log(res);
    //console.log(body);
  });
}

function sendclient(value) {
  wss.clients.forEach((client) => {
    client.send(new Date().toLocaleString() + ' ' + value);
  });
}
