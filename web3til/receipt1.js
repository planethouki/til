require('dotenv').config()
const fs = require('fs');
const Web3 = require('web3');
const PrivateKeyProvider = require("truffle-privatekey-provider");

const privateKey = process.env.PRIVATE_KEY_A;
const provider = new PrivateKeyProvider(privateKey, process.env.HOST);

const web3 = new Web3(provider);

async function exec() {

    const account = await new Promise((resolve, reject) => {
        web3.eth.getAccounts((error,result) => {
            resolve(result[0]);
        })
    });
    
    const receipt = await new Promise((resolve, reject) => {
        web3.eth.getTransactionReceipt("0x17e18cdb0c0026bae52996d5681b67500ba0a9bb065d28c92c16afe7d6a30dd2", (error,result) => {
            resolve(result);
        })
    });

    console.log(receipt);
    
}


exec();

