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

const sub = async (driver, account) => {
    await driver.get(`http://faucet-96x-01.symboldev.network/?recipient=${account.address.plain()}&amount=10000`)
    await driver.wait(until.elementLocated(By.css('form button')))
    await async.retry({times: 5, interval: 1000}, callback => {
        return driver.findElements(By.css('form button'))
            .then((buttons) => {
                return Promise.all([
                    buttons[1].click(),
                    buttons[1].click(),
                    buttons[1].click(),
                    buttons[1].click(),
                    buttons[1].click(),
                    buttons[1].click()
                ])
            })
            .then(() => {
                callback()
            })
            .catch((e) => {
                callback(e)
            })
    })
}

const main = async () => {
    const driver = await new Builder().forBrowser('chrome').build()
    const mnemonic = new hd.MnemonicPassPhrase(process.env.MNIMONIC)
    const wallet = new hd.Wallet(hd.ExtendedKey.createFromSeed(mnemonic.toSeed(), hd.Network.CATAPULT_PUBLIC))
    // const account = Account.generateNewAccount(networkType)
    try {
        for (let i = 2; i < 3; i++) {
            const account = wallet.getChildAccount(`m/44'/43'/0'/0/${i}`, NetworkType.TEST_NET)
            console.log(account.address.plain())
            await sub(driver, account)
        }
        await driver.quit()
    } catch(e) {
        console.error(e.message)
        await driver.quit()
    }
}

main()
