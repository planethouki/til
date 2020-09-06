const { 
    Account,
    Deadline,
    Mosaic,
    MosaicId,
    NetworkType,
    PlainMessage,
    RepositoryFactoryHttp,
    TransferTransaction,
    UInt64
} = require('symbol-sdk');

const PRIVATE_KEY = '13E123227BA91F170F38DA4C6A251B48F4B903271D803A7FCEEDFFACB1118198'
const MOSAIC_ID = "5E62990DCAC5BE8A"
const GENERATION_HASH = '1DFB2FAA9E7F054168B0C5FCB84F4DEB62CC2B4D317D861F3168D161F54EA78B'
const NODE_URL = 'http://0964-api.48gh23s.xyz:3000'

const networkType = NetworkType.TEST_NET


const main = async () => {
    const initiator = Account.createFromPrivateKey(PRIVATE_KEY, networkType)
    
    // const initiator = Account.generateNewAccount(networkType)
    
    console.log(initiator.privateKey)
    console.log(initiator.publicAccount.publicKey)
    console.log(initiator.address.plain())
    console.log(initiator.address.pretty())

    const recipientAddress = initiator.address

    const transactionHttp = new RepositoryFactoryHttp(NODE_URL).createTransactionRepository();

    const transferTransaction = TransferTransaction.create(
        Deadline.create(),
        recipientAddress,
        [new Mosaic (new MosaicId(MOSAIC_ID), UInt64.fromUint(0))],
        PlainMessage.create(new Date().toISOString()),
        networkType,
        UInt64.fromUint(10000 * Math.random() + 20100)
    );
    const signedTransaction = initiator.sign(transferTransaction, GENERATION_HASH);
    await transactionHttp
        .announce(signedTransaction)
        .toPromise()
        .then(() => {
            console.log(`${signedTransaction.hash}`)
        })
        .catch((e) => {
            console.error(e)
        });
}

main();
