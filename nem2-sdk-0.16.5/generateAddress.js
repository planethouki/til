"use strict";
exports.__esModule = true;
var nem2_sdk_1 = require("nem2-sdk");
var newAccount = nem2_sdk_1.Account.generateNewAccount(nem2_sdk_1.NetworkType.TEST_NET);
console.log(newAccount.address.plain());
