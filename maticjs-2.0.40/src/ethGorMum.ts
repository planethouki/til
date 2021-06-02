require('dotenv').config()
import { MaticPOSClient } from '@maticnetwork/maticjs'
const Web3 = require('web3')

const parentProvider = new Web3(process.env.GOERLI_ENDPOINT)
const maticProvider = new Web3(process.env.MUMBAI_ENDPOINT)

const maticPOSClient: MaticPOSClient = new MaticPOSClient({
    network: "testnet",
    version: "mumbai",
    parentProvider,
    maticProvider
});

const from = parentProvider.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)
const amount: string = "1000"

const main = async () => {
    await maticPOSClient.depositEtherForUser(from, amount, {
        from,
        gasPrice: "1000000000",
    });
}

main();