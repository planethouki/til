const nem = require("nem2-sdk")
const crypto = require("crypto")
const jssha3 = require('js-sha3')
const sha3_512 = jssha3.sha3_512
const rx = require('rxjs')
const op = require('rxjs/operators')


/* private network (http://catapult48gh23s.xyz)
Alice:
  private: 7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4
  public: 5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C
  address: SBWEUWON6IBHCW5IC4EI6V6SMTVJGCJWGLF57UGK
Bob:
  private: 31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E
  public: 3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57
  address: SB2Y5ND4FDLBIO5KHXTKRWODDG2QHIN73DTYT2PC

  nem2-cli profile create -p 7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4 -u http://catapult48gh23s.xyz:3000 -n MIJIN_TEST --profile alice48
  nem2-cli profile create -p 31B96EEB0C7FD6F8FB6B4ED09A9EB142A42B194AFBEB9EB52F0B79889F22326E -u http://catapult48gh23s.xyz:3000 -n MIJIN_TEST --profile bob48
*/

/* public network (http://catapult-test.44uk.net)
Alice:
  private: 8CBA73B9DF31D85DCFA4B9E1D3B7A88E5A5F32C930FCC45FE5A457619F3E6687
  public: C36F5BDDE8B2B586D17A4E6F4B999DD36EBD114023C1231E38ABCB1976B938C0
  address: SBNRDTMZ3MF4RFNQA2ZA33G74EGTINCKX2EHYYHY
Bob:
  private: BA46F91D7BCD40B6482E138F0D3D53A29F0A6097B5C4586C6ABD81A3BA3A2DAD
  public: 1C650F49DD67EC50BFDEA40906D32CDE3C969BDF58837C7DA320829BDDE96150
  address: SCBCMLVDJBXARCOI6XSKEU3ER2L6HH7UBEPTENGQ

  nem2-cli profile create -p 8CBA73B9DF31D85DCFA4B9E1D3B7A88E5A5F32C930FCC45FE5A457619F3E6687 -u http://catapult-test.44uk.net:3000 -n MIJIN_TEST --profile alice44
  nem2-cli profile create -p BA46F91D7BCD40B6482E138F0D3D53A29F0A6097B5C4586C6ABD81A3BA3A2DAD -u http://catapult-test.44uk.net:3000 -n MIJIN_TEST --profile bob44
*/

const WAIT_HEIGHT = 0
const RESOURCE_NOT_FOUND = 'ResourceNotFound'
const amount = 123
const NETWORK_TYPE = nem.NetworkType.MIJIN_TEST

const API_URL_PRIVATE = "http://catapult48gh23s.xyz:3000"
const API_URL_PUBLIC = "http://catapult-test.44uk.net:3000"

const privHostAccount = nem.Account.createFromPrivateKey("7808B5B53ECF24E40BE17B8EC3D0EB5F7C3F3D938E0D95A415F855AD4C27B2A4", NETWORK_TYPE)
const pubHostAccount = nem.Account.createFromPrivateKey("8CBA73B9DF31D85DCFA4B9E1D3B7A88E5A5F32C930FCC45FE5A457619F3E6687", NETWORK_TYPE)

const pubSenderAccount = nem.Account.createFromPrivateKey("BA46F91D7BCD40B6482E138F0D3D53A29F0A6097B5C4586C6ABD81A3BA3A2DAD", NETWORK_TYPE)

const privChain = {
    accountHttp: new nem.AccountHttp(API_URL_PRIVATE),
    blockchainHttp: new nem.BlockchainHttp(API_URL_PRIVATE),
    mosaicHttp: new nem.MosaicHttp(API_URL_PRIVATE),
    namespaceHttp: new nem.NamespaceHttp(API_URL_PRIVATE),
    transactionHttp: new nem.TransactionHttp(API_URL_PRIVATE),
    listener: new nem.Listener(API_URL_PRIVATE),
    mosaicService: null,
}
privChain.mosaicService = new nem.MosaicService(privChain.accountHttp, privChain.mosaicHttp, privChain.namespaceHttp)

const pubChain = {
    accountHttp: new nem.AccountHttp(API_URL_PUBLIC),
    blockchainHttp: new nem.BlockchainHttp(API_URL_PUBLIC),
    mosaicHttp: new nem.MosaicHttp(API_URL_PUBLIC),
    namespaceHttp: new nem.NamespaceHttp(API_URL_PUBLIC),
    transactionHttp: new nem.TransactionHttp(API_URL_PUBLIC),
    listener: new nem.Listener(API_URL_PUBLIC),
    mosaicService: null,
}
pubChain.mosaicService = new nem.MosaicService(pubChain.accountHttp, pubChain.mosaicHttp, pubChain.namespaceHttp)

const privRecipient = nem.Address.createFromRawAddress("SB2Y5ND4FDLBIO5KHXTKRWODDG2QHIN73DTYT2PC")
const pubSender = nem.Address.createFromRawAddress("SCBCMLVDJBXARCOI6XSKEU3ER2L6HH7UBEPTENGQ")

// const currentHeight = await blockchainHttp.getBlockchainHeight().toPromise().catch(err => err)

pubChain.listener.open().then(() => {
    pubChain.listener
    .status(pubSender)
    .pipe()
    .subscribe(x => console.log(x), err => console.error(err));

    pubChain.listener
    .status(pubHostAccount.address)
    .pipe()
    .subscribe(x => console.log(x), err => console.error(err));
})
privChain.listener.open().then(() => {
    privChain.listener
    .status(privRecipient)
    .pipe()
    .subscribe(x => console.log(x), err => console.error(err));

    privChain.listener
    .status(privHostAccount.address)
    .pipe()
    .subscribe(x => console.log(x), err => console.error(err));
})

rx.forkJoin(
    [
        privChain.mosaicService.mosaicsAmountViewFromAddress(privHostAccount.address)
            .pipe(
                op.mergeMap(_ => _),
                op.filter(mo => mo.fullName() === 'nem:xem')
            ),
        pubChain.mosaicService.mosaicsAmountViewFromAddress(pubSender)
            .pipe(
                op.mergeMap(_ => _),
                op.filter(mo => mo.fullName() === 'nem:xem'),
                op.defaultIfEmpty(),
                op.catchError(err => {
                    const response = JSON.parse(err.response.text);
                    if (response.code == RESOURCE_NOT_FOUND) {
                        return rx.of(null)
                    } else {
                        return rx.throwError('Something wrong with MosaicService response')
                    }
                }),
            ),
        privChain.accountHttp.outgoingTransactions(privHostAccount.publicAccount)
            .pipe(
                op.mergeMap(_ => _),
                op.filter(tx => {
                    true
                    // return tx.recipient.address == recipient.address &&
                    // currentHeight.compact() - tx.transactionInfo.height.compact() < WAIT_HEIGHT
                }),
                op.toArray()
            ),
        privChain.accountHttp.unconfirmedTransactions(privHostAccount.publicAccount)
            .pipe(
                op.mergeMap(_ => _),
                op.filter(tx => tx.recipient.address == privRecipient.address),
                op.toArray()
            ),
        pubChain.accountHttp.getAccountInfo(pubSender)
            .pipe(
                op.defaultIfEmpty(),
                op.catchError(err => {
                    const response = JSON.parse(err.response.text);
                    if (response.code == RESOURCE_NOT_FOUND) {
                        return rx.of(null)
                    } else {
                        return rx.throwError('Something wrong with MosaicService response')
                    }
                }),
            ),
    ]
)
.subscribe({
    secret: null,
    proof: null,
    signedTx1pub: null,
    signedLockFundsTx1pub: null,
    signedTx1priv: null,
    signedTx2pub: null,
    signedTx2priv: null,
    next(results) {
        const privHostMosaics = results[0]     // MosaicAmountView Array
        const pubSenderMosaics = results[1]     // MosaicAmountView Array
        const privHostOutgoingTxs = results[2]    // Transaction Array
        const privHostUnconfirmedTxs = results[3]     // Transaction Array
        const pubSenderInfo = results[4]            // AccountInfo

        // determine amount to pay out
        // const myEffectiveBalance = privServerMosaics.amount.compact() - 1000000
        // const txAmount = sanitizeAmount(amount) || Math.min(myEffectiveBalance, randomInRange(MIN_XEM, MAX_XEM))
        const txAmount = amount * 100000
        // console.debug(`faucet balance => %d`, myEffectiveBalance)
        // console.debug(`pay out amount => %d`, txAmount)

        if(pubSenderMosaics === null) {
            console.debug(`cannot get claimer balance`)
            // req.flash('error', `Your account do not have enougth balance => (%s)`, 0)
            // res.redirect(`/?${query}`)
            return
        } else if(pubSenderMosaics.amount.compact() <= txAmount) {
            console.debug(`claimer balance => %d`, pubSenderMosaics.amount.compact())
            // req.flash('error', `Your account do not have enougth balance => (%s)`, senderMosaicAmountView.relativeAmount())
            // res.redirect(`/?${query}`)
            return
        }

        if(pubSenderInfo === null) {
            console.debug(`cannot get claimer account info`)
            return
        } else if(pubSenderInfo.publicKey === '0000000000000000000000000000000000000000000000000000000000000000') {
            console.debug(`cannot get claimer publickey`)
            return
        }



        console.debug(`${API_URL_PRIVATE} Server Balance => %d`, privHostMosaics.amount.compact())
        console.debug(`${API_URL_PUBLIC} Claimer Balance => %d`, pubSenderMosaics.amount.compact())
        

        const random = crypto.randomBytes(10);
        const hash = sha3_512.create();
        this.secret = hash.update(random).hex().toUpperCase();
        this.proof = random.toString('hex');
        
        console.debug('x    (proof)     : ' + this.proof);
        console.debug('H(x) (secret)    : ' + this.secret);

        const innerTx1pub = nem.SecretLockTransaction.create(
            nem.Deadline.create(),
            new nem.Mosaic(new nem.MosaicId('nem:xem'), nem.UInt64.fromUint(txAmount)),
            nem.UInt64.fromUint(96*60),
            nem.HashType.SHA3_512,
            this.secret,
            pubHostAccount.address,
            NETWORK_TYPE
        )
        const tx1pub = nem.AggregateTransaction.createBonded(
            nem.Deadline.create(),
            [
                innerTx1pub.toAggregate(pubSenderInfo.publicAccount),
            ],
            NETWORK_TYPE
        )
        this.signedTx1pub = pubHostAccount.sign(tx1pub)
        const lockFundsTx1pub = nem.LockFundsTransaction.create(
            nem.Deadline.create(),
            nem.XEM.createRelative(10),
            nem.UInt64.fromUint(480),
            this.signedTx1pub,
            NETWORK_TYPE
        )
        this.signedLockFundsTx1pub = pubHostAccount.sign(lockFundsTx1pub)
        

        const tx1priv = nem.SecretLockTransaction.create(
            nem.Deadline.create(),
            new nem.Mosaic(new nem.MosaicId('nem:xem'), nem.UInt64.fromUint(txAmount)),
            nem.UInt64.fromUint(80*60),
            nem.HashType.SHA3_512,
            this.secret,
            pubSender,
            NETWORK_TYPE
        )
        this.signedTx1priv = privHostAccount.sign(tx1priv)

        console.debug(`tx1pub: ${this.signedTx1pub.hash}`)
        console.debug(`lockfunds tx1pub: ${this.signedLockFundsTx1pub.hash}`)
        console.debug(`tx1priv: ${this.signedTx1priv.hash}`)
        console.debug(`pubSenderInfo.publicAccount: ${pubSenderInfo.publicAccount.publicKey}`)


        // const tx2pub = nem.SecretProofTransaction.create(
        //     nem.Deadline.create(),
        //     nem.HashType.SHA3_512,
        //     this.secret,
        //     this.proof,
        //     NETWORK_TYPE
        // );
        // this.signedTx2pub = pubHostAccount.sign(tx2pub)

        // const tx2priv = nem.SecretProofTransaction.create(
        //     nem.Deadline.create(),
        //     nem.HashType.SHA3_512,
        //     this.secret,
        //     this.proof,
        //     NETWORK_TYPE
        // );
        // this.signedTx2priv = privHostAccount.sign(tx2priv)




        // privChain.transactionHttp
        //     .announce(this.signedTx1priv)
        //     .subscribe(x => console.log(x), err => console.error(err));

        pubChain.transactionHttp
            .announce(this.signedLockFundsTx1pub)
            .subscribe(x => console.log(x), err => console.error(err));
    
        pubChain.listener
            .confirmed(pubHostAccount.address)
            .pipe(
                op.filter((transaction) => transaction.transactionInfo !== undefined
                    && transaction.transactionInfo.hash === this.signedLockFundsTx1pub.hash),
                op.mergeMap(ignored => pubChain.transactionHttp.announceAggregateBonded(this.signedTx1pub))
            )
            .subscribe(x => console.log(x), err => console.error(err));
            
        pubChain.listener
            .aggregateBondedAdded(pubSender)
            .pipe(
                op.filter((transaction) => transaction.transactionInfo !== undefined
                    && transaction.transactionInfo.hash === this.signedTx1pub.hash),
                op.map(transaction => {
                    console.debug(`claimer detected tx1pub. hash: ${transaction.transactionInfo.hash}`)
                    const cosignatureTransaction = nem.CosignatureTransaction.create(transaction);
                    return pubSenderAccount.signCosignatureTransaction(cosignatureTransaction);
                }),
                op.mergeMap(cosignatureSignedTransaction  => {
                    console.debug("claimer cosigned tx1pub")
                    console.debug(`parent hash: ${cosignatureSignedTransaction.parentHash}`)
                    console.debug(`signer: ${cosignatureSignedTransaction.signer}`)
                    return pubChain.transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction)
                }),
            )
            .subscribe(x => console.log(x), err => console.error(err));
    
        pubChain.listener
            .confirmed(pubHostAccount.address)
            .pipe(
                op.filter((transaction) => transaction.transactionInfo !== undefined
                    && transaction.transactionInfo.hash === this.signedTx1pub.hash),
                // op.mergeMap(ignored => pubChain.transactionHttp.announce(this.signedTx2pub)),
                // op.mergeMap(ignored => privChain.transactionHttp.announce(this.signedTx2priv))
            )
            .subscribe(x => console.log(x), err => console.error(err));
        
    },
    error(err) {
        console.error(err)
    },
    complete() {
    }
})

