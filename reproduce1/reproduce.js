/**
 * 0. Install `nem2-sdk`
 * 1. Prepare an account with some `cat.currency`.
 * 2. Run this script.
 * 3. See outgoings.
 *
 * Ex)
 * PRIVATE_KEY=AAAA... API_URL=http://13.114.200.132:3000 node reproduce.js
 */
const nem = require('nem2-sdk');
const crypto = require('crypto');

const url = process.env.API_URL || 'http://catapult48gh23s.xyz:3000/';
const privateKey = process.env.PRIVATE_KEY || 'E4715D6B61A32C6BFD5D17413F96C42A168337078015395BC8DA6488E7E107D7';
const initiater = nem.Account.createFromPrivateKey(privateKey, nem.NetworkType.MIJIN_TEST)
const recipient = nem.Account.generateNewAccount(nem.NetworkType.MIJIN_TEST)
const nsString = crypto.randomBytes(8).toString('hex') // get random string for namespace
const nsId = new nem.NamespaceId(nsString);

console.log('Initiator: %s', initiater.address.pretty());
console.log('Endpoint:  %s/account/%s', url, initiater.address.plain());
console.log('Outgoing:  %s/account/%s/transactions/outgoing', url, initiater.publicKey);

console.log('Recipient: %s', recipient.address.pretty());
console.log('Endpoint:  %s/account/%s', url, recipient.address.plain());
console.log('incoming:  %s/account/%s/transactions/incoming', url, recipient.publicKey);

console.log('Namespace: %s', nsString);
console.log('Endpoint:  %s/namespace/%s', url, nsId.toHex());
console.log('');

// recognize recipient address
const transfer0Tx = nem.TransferTransaction.create(
  nem.Deadline.create(),
  recipient.address,
  [],
  nem.PlainMessage.create('Recognize recipient address for network.'),
  nem.NetworkType.MIJIN_TEST
);

// register namespace
const nsRegisterTx = nem.RegisterNamespaceTransaction.createRootNamespace(
  nem.Deadline.create(),
  nsString,
  nem.UInt64.fromUint(10),
  nem.NetworkType.MIJIN_TEST
)

// alias account
const aliasTx = nem.AddressAliasTransaction.create(
  nem.Deadline.create(),
  nem.AliasActionType.Link,
  nsId,
  recipient.address,
  nem.NetworkType.MIJIN_TEST
);

// set Address as recipient
const transfer1Tx = nem.TransferTransaction.create(
  nem.Deadline.create(),
  recipient.address,
  [nem.NetworkCurrencyMosaic.createRelative(1)],
  nem.PlainMessage.create('Send to myself via address.'),
  nem.NetworkType.MIJIN_TEST
);

// set NamespaceId as recipient
const transfer2Tx = nem.TransferTransaction.create(
  nem.Deadline.create(),
  nsId,
  [nem.NetworkCurrencyMosaic.createRelative(1)],
  nem.PlainMessage.create('Send to myself via namespace.'),
  nem.NetworkType.MIJIN_TEST
);

const nsHttp = new nem.NamespaceHttp(url);
const txHttp = new nem.TransactionHttp(url)
const listener = new nem.Listener(url)
let counter = 0
listener.open().then(() => {
  listener.status(initiater.address).subscribe(res => console.log(res))
  listener.confirmed(initiater.address).subscribe(tx => {
    switch (tx.type) {
      case nem.TransactionType.TRANSFER:
        console.log('Transferred.')
        counter++
        break;
      case nem.TransactionType.REGISTER_NAMESPACE:
        console.log('Namespace registered.')
        txHttp.announce(initiater.sign(aliasTx)).subscribe()
        break;
      case nem.TransactionType.ADDRESS_ALIAS:
        console.log('Address aliased.')
        txHttp.announce(initiater.sign(transfer1Tx)).subscribe()
        txHttp.announce(initiater.sign(transfer2Tx)).subscribe()
        break;
      default:
        console.log(tx)
        break;
    }
    if (counter === 1) {
      txHttp.announce(initiater.sign(nsRegisterTx)).subscribe()
    }

    if (counter >= 3) {
      nsHttp.getLinkedAddress(nsId).subscribe(address => {
          console.log('')
          console.log('Namespace: %s', nsId.fullName);
          console.log('Aliased:   %s', address.pretty());
          console.log('')
        },
        err => console.error('Error: ', err)
      );

      console.log('')
      console.log('See transfer transactions.')
      //listener.close()
    }
  })
  txHttp.announce(initiater.sign(transfer0Tx)).subscribe()
})
