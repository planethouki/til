var nem = require('nem-sdk').default;
var request = require('request');

var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

var address = "TA2VKRQKUJDOBIAEX2METU4UBZ6MCSERPJE3UEOT";
var startDate = new Date();
var lastValue = 0;

var url = 'https://maker.ifttt.com/trigger/nem_message/with/key/'+process.env.IFTTT_KEY;

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
      postifttt(lastValue+' -> '+value);
    } else {
      console.log('No Value activity');
    };
    lastValue = value;
  })

  nem.com.requests.account.transactions.unconfirmed(endpoint, address).then( (txsData) => {
    if ( txsData.data.length > 0 ) {
      var value = txsData
        .data
        .map( (tx) => {
          postifttt(JSON.stringify(tx));
        })
    } else {
      console.log('No unconfirmed transactions');
    }

  });

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
    console.log(err);
    //console.log(res);
    //console.log(body);
  });
}
