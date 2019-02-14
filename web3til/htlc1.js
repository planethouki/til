require('dotenv').config()
const fs = require('fs');
const Web3 = require('web3');
const PrivateKeyProvider = require("truffle-privatekey-provider");

const privateKey = process.env.PRIVATE_KEY_4;
const provider = new PrivateKeyProvider(privateKey, process.env.HOST);

const web3 = new Web3(provider);

const recipient = "0xd11690c03f36cf220f9a4fbbcfc1658f306e4c6a";
const secretHash = "0x48dc79553781ed80927e14609c3f256d17d802a7c88c6505ad14af28f0131599";

async function exec() {
    const account = await new Promise((resolve, reject) => {
        web3.eth.getAccounts((error,result) => {
            resolve(result[0]);
        })
    });
    const abi = JSON.parse(fs.readFileSync('abi/HashedTimelock.json')).abi;
    const ct = web3.eth.contract(abi).at('0x21C0750C4bb2b38c52D997A06EAcBc7Dc48b90eE');
    const tx = await new Promise((resolve, reject) => {
        ct.newContract(
            recipient,
            secretHash,
            Math.floor(Date.now() / 1000) + 3600,
            {
                from: account,
                value: 1,
            },
            (error, result) => {
                if (error) reject(error)
                resolve(result);
            }
        )
    })
    console.log(tx)
}

exec();