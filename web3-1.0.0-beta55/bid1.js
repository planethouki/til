require('dotenv').config();
const Web3 = require('web3');
const PrivateKeyProvider = require("truffle-privatekey-provider");

const provider = new PrivateKeyProvider(process.env.PRIVATE_KEY, process.env.HOST);
const web3 = new Web3(provider);

(async () => {

    await web3.eth.sendTransaction({
        to: '0xa2156F24711A631e92e65dC114CF172065dDd49b',
        value: web3.utils.toWei('0.03', 'ether'),
        gas: 100000,
        gasPrice: 10000000000,
        data: '0x454a2ab3000000000000000000000000000000000000000000000000000000000000e100'
    })

})();

