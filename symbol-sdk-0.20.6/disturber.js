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
const winston = require('winston');
require('winston-daily-rotate-file');

const PRIVATE_KEY = '13E123227BA91F170F38DA4C6A251B48F4B903271D803A7FCEEDFFACB1118198'
const MOSAIC_ID = "5E62990DCAC5BE8A"
const GENERATION_HASH = '1DFB2FAA9E7F054168B0C5FCB84F4DEB62CC2B4D317D861F3168D161F54EA78B'
const NODE_URL = 'http://api-01.us-east-1.096x.symboldev.network:3000'

const networkType = NetworkType.TEST_NET

const createCounter = () => {
    let i = 0
    return {
        count: () => {
            i++
            return i
        }
    }
}

const mainLoop = async () => {
    const myFormat = winston.format.printf(({ level, message, label, timestamp }) => {
        return `${timestamp} ${level}: ${message}`;
    });
    const transport = new (winston.transports.DailyRotateFile)({
        filename: 'disturber-%DATE%.log',
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
    const counter = createCounter()
    const initiator = Account.createFromPrivateKey(PRIVATE_KEY, networkType)
    
    // const initiator = Account.generateNewAccount(networkType)
    
    logger.info(initiator.privateKey)
    logger.info(initiator.publicAccount.publicKey)
    logger.info(initiator.address.plain())
    logger.info(initiator.address.pretty())

    const recipientAddress = initiator.address

    const repositoryFactory = new RepositoryFactoryHttp(NODE_URL);
    const transactionHttp = repositoryFactory.createTransactionRepository();

    while (true) {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            recipientAddress,
            [new Mosaic (new MosaicId(MOSAIC_ID), UInt64.fromUint(0))],
            PlainMessage.create(new Date().toISOString()),
            networkType,
            UInt64.fromUint(2000000 * Math.random() + 20100)
        );

        const signedTransaction = initiator.sign(transferTransaction, GENERATION_HASH);

        transactionHttp
            .announce(signedTransaction)
            .toPromise()
            .then(() => {
                logger.info(`${counter.count()}: ${signedTransaction.hash}`)
            })

        await new Promise((resolve) => {
            setTimeout(resolve, 1000 * Math.random())
        })
    }
}

const tryCatchLoop = async () => {
    while (true) {
        try {
            await mainLoop()
        } catch(e) {
            logger.error(e)
        }
    }
}

tryCatchLoop()