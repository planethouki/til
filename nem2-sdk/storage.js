const nem2Sdk = require("nem2-sdk");
const BlockchainHttp = nem2Sdk.BlockchainHttp;
const host = "http://catapult48gh23s.xyz:3000";
const blockchainHttp = new BlockchainHttp(host);
blockchainHttp.getDiagnosticStorage().subscribe(
    x => console.log(x)
);