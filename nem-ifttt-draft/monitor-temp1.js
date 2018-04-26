var nem = require('nem-sdk').default;

var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

var address = "TA2VKRQKUJDOBIAEX2METU4UBZ6MCSERPJE3UEOT";
var startDate = new Date();
var lastValue = 0;

setInterval(function loop() {

  nem.com.requests.account.mosaics.owned(endpoint, address).then( (accountData) => {
    var value = accountData.data
      .filter(
          mosaic => mosaic.mosaicId.namespaceId == "nem"
          && mosaic.mosaicId.name == "xem"
        )
      .pop().quantity;
    if (value > lastValue) {
      //$('#stream').prepend('<p>'+date.toLocaleString()+': '+value'</p>');
      console.log(value);
    } else {
      console.log('No activity');
    };
    lastValue = value;
  })
}, 10000);
