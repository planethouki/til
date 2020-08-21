require('dotenv').config()
const ChronoUnit = require('js-joda').ChronoUnit
const axios = require('axios')
const hd = require('symbol-hd-wallets')
const async = require('async')
const { 
    Account,
    AggregateTransaction,
    Deadline,
    Mosaic,
    MosaicDefinitionTransaction,
    MosaicFlags,
    MosaicId,
    MosaicNonce,
    MosaicSupplyChangeAction,
    MosaicSupplyChangeTransaction,
    NetworkType,
    PlainMessage,
    RepositoryFactoryHttp,
    TransferTransaction,
    UInt64
} = require('symbol-sdk');
const winston = require('winston');
require('winston-daily-rotate-file');

const myFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});
const transport = new (winston.transports.DailyRotateFile)({
    filename: 'mosaic-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.label({ label: 'label' }),
        winston.format.timestamp(),
        myFormat
    ),
    transports: [
        transport,
        new winston.transports.Console()
    ],
});

const networkType = NetworkType.TEST_NET
const MOSAIC_ID = "5E62990DCAC5BE8A"
const GENERATION_HASH = '1DFB2FAA9E7F054168B0C5FCB84F4DEB62CC2B4D317D861F3168D161F54EA78B'
const NODE_URL_LIST = [
    'http://api-01.us-east-1.096x.symboldev.network:3000',
    'http://api-01.eu-west-1.096x.symboldev.network:3000',
    'http://api-01.us-west-1.096x.symboldev.network:3000',
    'http://api-01.ap-southeast-1.096x.symboldev.network:3000',
    'http://api-01.eu-central-1.096x.symboldev.network:3000',
    'http://api-01.ap-northeast-1.096x.symboldev.network:3000',
]

const transactionHttpArray = NODE_URL_LIST.map((NODE_URL) => {
    return new RepositoryFactoryHttp(NODE_URL);
}).map((repo) => {
    return repo.createTransactionRepository()
})

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const createCounter = () => {
    let i = 0
    return {
        count: () => {
            i++
            return i
        }
    }
}

const counter = createCounter()

const wait = async (ms = 100) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

const sub = async (nonceNumber, account) => {
    const nonce = MosaicNonce.createFromNumber(nonceNumber)
    const isSupplyMutable = true;
    const isTransferable = true;
    const isRestrictable = true;
    const divisibility = getRandomInt(0, 6);
    const duration = UInt64.fromUint(0);
    const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
        Deadline.create(),
        nonce,
        MosaicId.createFromNonce(nonce, account.address),
        MosaicFlags.create(isSupplyMutable, isTransferable, isRestrictable),
        divisibility,
        duration,
        networkType
    );
    const delta = Math.floor(8999999999 * Math.random());
    const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
        Deadline.create(),
        mosaicDefinitionTransaction.mosaicId,
        MosaicSupplyChangeAction.Increase,
        UInt64.fromUint(delta * Math.pow(10, divisibility)),
        networkType
    );
    const transaction = AggregateTransaction.createComplete(
        Deadline.create(3, ChronoUnit.MINUTES),
        [
            mosaicDefinitionTransaction.toAggregate(account.publicAccount),
            mosaicSupplyChangeTransaction.toAggregate(account.publicAccount)],
        networkType,
        [],
        UInt64.fromUint(31200 * (1 + Math.random()))
    );
    const signedTransaction = account.sign(transaction, GENERATION_HASH);
    const transactionHttp = transactionHttpArray[getRandomInt(0, transactionHttpArray.length)]
    const send = transactionHttp
        .announce(signedTransaction)
        .toPromise()
        .then(() => {
            logger.info(`${counter.count()}: ${signedTransaction.hash}`)
        })
    await Promise.race([send, wait(10 * Math.random())])
}


const main = async (from, to) => {
    try {
        const mnemonic = new hd.MnemonicPassPhrase(process.env.MNIMONIC)
        const wallet = new hd.Wallet(hd.ExtendedKey.createFromSeed(mnemonic.toSeed(), hd.Network.CATAPULT_PUBLIC))
        const account = wallet.getChildAccount(`m/44'/43'/2'/0/0`, NetworkType.TEST_NET)
        // TD6AGWB54LUEIOTD4OC654AUE5LKDT5C2PIMC7I
        for (let i = from; i < to; i++) {
            await sub(i, account)
        }
    } catch(e) {
        console.error(e.message)
    }
}

module.exports = {
    main
}
