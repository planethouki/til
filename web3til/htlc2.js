require('dotenv').config()
const fs = require('fs');
const Web3 = require('web3');
const PrivateKeyProvider = require("truffle-privatekey-provider");

const privateKey = process.env.PRIVATE_KEY_B;
const provider = new PrivateKeyProvider(privateKey, process.env.HOST);

const web3 = new Web3(provider);

const secret = "0x28d0a13c6abaab59a1eb94c6250fae325c37c9b1ef2a7d9b37ceecfe59b84ab3";
const contractId = "0x49c35ec3b1da83a4495293202bc58bc7e31ed0b39c416a557c9ca365c1e51a3a";

async function exec() {

    const account = await new Promise((resolve, reject) => {
        web3.eth.getAccounts((error,result) => {
            resolve(result[0]);
        })
    });
    console.log(`account: ${account}`);

    const abi = JSON.parse(fs.readFileSync('abi/HashedTimelock.json')).abi;
    
    const ct = web3.eth.contract(abi).at('0x21C0750C4bb2b38c52D997A06EAcBc7Dc48b90eE');
    const tx = await new Promise((resolve, reject) => {
        ct.withdraw(
            contractId,
            secret,
            {
                from: account,
                gas: 100000,
                gasPrice: 1000000000
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