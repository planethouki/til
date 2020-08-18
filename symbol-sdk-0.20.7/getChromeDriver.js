const fs = require('fs')
const download = require('download')
const unzipper = require('unzipper')
const rimraf = require('rimraf')
const async = require('async')

async.series([
    done => {
        rimraf('chromedriver_win32.zip', done)
    },
    done => {
        rimraf('chromedriver.exe', done)
    },
    done => {
        download('https://chromedriver.storage.googleapis.com/84.0.4147.30/chromedriver_win32.zip')
            .then((data) => {
                fs.writeFile('chromedriver_win32.zip', data, done)
            })
    },
    done => {
        fs.createReadStream('chromedriver_win32.zip')
            .pipe(unzipper.Extract({ path: 'tmp' }))
            .on('close', done)
    },
    done => {
        fs.rename('tmp/chromedriver.exe', './chromedriver.exe', done)
    },
    done => {
        rimraf('./tmp', done)
    }
])