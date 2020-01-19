/* global web3 */

module.exports = function(callback) {
    console.log()
    web3.eth.getAccounts().then((accounts) => {
        const arg = web3.eth.abi.encodeParameters(['uint256', 'address[]'], ['100000000000000000000000000', accounts]);
        console.log(arg)
    }).then(() => {
        callback();
    })
};
