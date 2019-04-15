var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "remember naive stairs dose six decorate catalog banner gaze tiny into lady";
var host = "https://ropsten.infura.io/v3/6d6832b8808346ab82226925aac5509d";
var provider = new HDWalletProvider(mnemonic, host, 0, 10);
var Web3 = require('web3');

var web3 = new Web3(provider);

web3.eth.getAccounts().then((accounts) => {
    console.log(accounts);
    provider.engine.stop();
})
