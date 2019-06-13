require('dotenv').config()
const fs = require('fs');
const Web3 = require('web3');
const PrivateKeyProvider = require("truffle-privatekey-provider");

const privateKey = process.env.PRIVATE_KEY_B;
const provider = new PrivateKeyProvider(privateKey, process.env.HOST);

const web3 = new Web3(provider);

async function exec() {

    const account = await new Promise((resolve, reject) => {
        web3.eth.getAccounts((error,result) => {
            resolve(result[0]);
        })
    });
    
    console.log(account);
    
}


exec();

