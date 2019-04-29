const nem2Sdk = require("nem2-sdk");

const NamespaceID = nem2Sdk.NamespaceId


console.log((new NamespaceID("cat.currency")).toHex().toUpperCase())
console.log((new NamespaceID("cat.harvest")).toHex().toUpperCase())