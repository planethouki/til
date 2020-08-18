require('dotenv').config()
const axios = require('axios')
const hd = require('symbol-hd-wallets')
const webdriver = require('selenium-webdriver')
const { Builder, By, until } = webdriver
const async = require('async')
const {
    Account,
    NetworkType
} = require('symbol-sdk')

const networkType = NetworkType.TEST_NET

const wait = async (ms = 100) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

const main = async () => {
    const mnemonic = new hd.MnemonicPassPhrase(process.env.MNIMONIC)
    const wallet = new hd.Wallet(hd.ExtendedKey.createFromSeed(mnemonic.toSeed(), hd.Network.CATAPULT_PUBLIC))
    // const account = Account.generateNewAccount(networkType)
    try {
        for (let i = 0; i < 20; i++) {
            const account = wallet.getChildAccount(`m/44'/43'/0'/0/${i}`, NetworkType.TEST_NET)
            console.log(account.address.plain())
            const res = await axios.get(`http://api-01.us-east-1.096x.symboldev.network:3000/accounts/${account.address.plain()}`)
            console.log(res.data.account.mosaics)
        }
    } catch(e) {
        console.error(e.message)
    }
}

main()
