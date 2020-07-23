const { AggregateTransaction, PublicAccount, SignedTransaction } = require('symbol-sdk')
const { MnemonicPassPhrase } = require('symbol-hd-wallets')
const { NIP13, NetworkConfig, TransactionParameters } = require('symbol-token-standards')
const { TransactionURI } = require('symbol-uri-scheme')

const { 
    Account,
    CosignatureTransaction,
    Deadline,
    HashLockTransaction,
    NetworkType,
    Mosaic,
    MosaicId,
    UInt64,
    RepositoryFactoryHttp
} = require('symbol-sdk')
const { TokenMetadata } = NIP13
const yaml = require('js-yaml')
const fs = require('fs')

const nodeUrl = 'http://gorilla-api.48gh23s.xyz:3000/'
const networkType = NetworkType.TEST_NET
const networkGenerationHashSeed = '4009619EB7A9F824C5D0EE0E164E0F99CCD7906A475D7768FD60B452204BD0A2'
const networkMosaicId = '05D6A80DE3C9ADCA'

// :warning: The following settings are network specific and may need changes
const transactionParams = new TransactionParameters(
  Deadline.create(),
  750000, // maxFee
)

// :warning: You should create separate backups of
// authorities and security token pass phrases.
// const authKeys = MnemonicPassPhrase.createRandom() // backup the resulting 24-words safely!
// const tokenKeys = MnemonicPassPhrase.createRandom() // backup the resulting 24-words safely!
const authKeys = new MnemonicPassPhrase('fresh favorite burst lava wrap erase horror evil enlist happy cash response thank share maze school bomb surround bounce brain atom charge pipe tenant')
const tokenKeys = new MnemonicPassPhrase('loan oval walnut bottom anchor business enough film garment pulp morning mirror notice puzzle frog topic situate mansion force small spoil legend cash slice')

// TDR7VY6FWAPMR3IGUPXENYOICTK2A27M4WGQEKEX
// 3DA6BADA491D0C1319492801EBF715B909C2B9DEE8138338BEE5FD3F3E9A4623
const op1 = Account.createFromPrivateKey('87EDDCED544F5C85CA449ED477193971956721C32676750E4A62241CEF086C31', networkType)
// TDM3XPO6L64LGFZ2DDOPJQCT5T55QHIZAY2KCX6Z
// D86CDDD1103F85D1AA34A2F85F0F4B51E3C9EDA3CB0D9BCAD786088DABD40EBE
const op2 = Account.createFromPrivateKey('BB9645CED16FA43C9F3E7C8DA1BE97A8253993A62F92FA4B3C449359E8FEB580', networkType)

// :warning: It is recommended to create operator
// keys offline and using a separate device.
const operators = [
    op1.publicAccount,
    op2.publicAccount,
]

const network = new NetworkConfig(
    nodeUrl,
    networkType,
    networkGenerationHashSeed,
    new MosaicId(networkMosaicId)
)
const tokenAuthority = new NIP13.TokenAuthority(network, authKeys)
const securityToken = new NIP13.Token(network, tokenKeys)

const metadata = new TokenMetadata(
    'MIC',
    'ISIN',
    'ISO_10962',
    'Website',
    'Sector',
    'Industry',
    {
      'customKey1': 'metadata',
    },
)

const tokenId = securityToken.create(
    'aaaa', // security token name
    securityToken.getTarget().publicAccount, // actor
    tokenAuthority.getAuthority().publicAccount, // token authority
    operators,
    123456789, // total outstanding shares
    metadata,
    transactionParams,
)



const resultURI = securityToken.result

const transaction = resultURI.toTransaction()
const signedTransaction = securityToken.getTarget().sign(transaction, networkGenerationHashSeed)

const repositoryFactory = new RepositoryFactoryHttp(nodeUrl)
const transactionHttp = repositoryFactory.createTransactionRepository()
const accountHttp = repositoryFactory.createAccountRepository()

fs.writeFileSync('transaction.yml', yaml.safeDump(transaction.toJSON()))
fs.writeFileSync('token.yml', yaml.safeDump(tokenId))
fs.writeFileSync('keys.yml', yaml.safeDump({authKeys, tokenKeys}));


(async () => {
    
    const hashLockTransaction = HashLockTransaction.create(
        Deadline.create(),
        new Mosaic(new MosaicId(networkMosaicId), UInt64.fromUint(10000000)),
        UInt64.fromUint(360),
        signedTransaction,
        networkType,
        UInt64.fromUint(750000)
    )
    const signedHashLockTransaction = securityToken
        .getTarget()
        .sign(hashLockTransaction, networkGenerationHashSeed)

    await transactionHttp
        .announce(signedHashLockTransaction)
        .toPromise()

    console.log(`announce signedHashLockTransaction ${signedHashLockTransaction.hash}`)

    for (let i = 0; i < 100; i++) {
        try {
            const status = await transactionHttp
                .getTransactionStatus(signedHashLockTransaction.hash)
                .toPromise()
            if (status.group === 'confirmed') {
                break
            }
            console.log(status.group)
            await new Promise((r) => setTimeout(r, 1000))
        } catch (e) {
            console.error(e.message)
            await new Promise((r) => setTimeout(r, 1000))
        }
    }
    
    await transactionHttp
        .announceAggregateBonded(signedTransaction)
        .toPromise()

    console.log(`announce signedTransaction ${signedTransaction.hash}`)

    for (let i = 0; i < 100; i++) {
        try {
            const status = await transactionHttp
                .getTransactionStatus(signedTransaction.hash)
                .toPromise()
            if (status.group === 'partial') {
                break
            }
            console.log(status.group)
            await new Promise((r) => setTimeout(r, 1000))
        } catch (e) {
            console.error(e.message)
            await new Promise((r) => setTimeout(r, 1000))
        }
    }

    const getAccountPartialTransactions = await accountHttp
        .getAccountPartialTransactions(securityToken.getTarget().address)
        .toPromise()

    const [partialTransaction] = getAccountPartialTransactions
        .filter((t) => t.transactionInfo.hash === signedTransaction.hash)
    
    await transactionHttp
        .announceAggregateBondedCosignature(
            CosignatureTransaction.create(partialTransaction).signWith(op1)
        )
        .toPromise()
    
    await transactionHttp
        .announceAggregateBondedCosignature(
            CosignatureTransaction.create(partialTransaction).signWith(op2)
        )
        .toPromise()

    for (let i = 0; i < 100; i++) {
        try {
            const status = await transactionHttp
                .getTransactionStatus(signedTransaction.hash)
                .toPromise()
            if (status.group === 'confirmed') {
                break
            }
            console.log(status.group)
            await new Promise((r) => setTimeout(r, 1000))
        } catch (e) {
            console.error(e.message)
            await new Promise((r) => setTimeout(r, 1000))
        }
    }
    
})()

