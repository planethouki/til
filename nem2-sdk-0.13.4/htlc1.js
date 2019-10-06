const {
    Account,
    AccountHttp,
    Deadline,
    HashType,
    Listener,
    NetworkType,
    NetworkHttp,
    Mosaic,
    MosaicId,
    NamespaceId,
    PlainMessage,
    SecretLockTransaction,
    SecretProofTransaction,
    TransactionHttp,
    TransferTransaction,
    UInt64
} = require('nem2-sdk');
const op = require('rxjs/operators');
const rx = require('rxjs');
const crypto = require("crypto");
const { sha3_256 } = require('js-sha3');

process.env.HOST = 'http://fushicho.48gh23s.xyz:3000';
process.env.GENERATION_HASH = '9A7949B3ED05DE9C771B8BEB16226E1CEBCA4C50428F27445796C8B4D9B0A9D6';


const alice = Account.generateNewAccount(NetworkType.MIJIN_TEST)
const bob = Account.generateNewAccount(NetworkType.MIJIN_TEST)
const carol = Account.generateNewAccount(NetworkType.MIJIN_TEST)

const rich = Account.createFromPrivateKey(
    '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E',
    NetworkType.MIJIN_TEST
)

const exec = async () => {

    console.log("Alice", alice.address.plain(), "Bob", bob.address.plain(), "Carol", carol.address.plain())

    const transactionHttp = new TransactionHttp(process.env.HOST);
    const networkHttp = new NetworkHttp(process.env.HOST);
    const accountHttp = new AccountHttp(process.env.HOST, networkHttp);
    

    const distTxHashs = [alice, bob, carol].map((account) => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            account.address,
            [new Mosaic(new NamespaceId('cat.currency'), UInt64.fromUint(10000000))],
            new PlainMessage(''),
            NetworkType.MIJIN_TEST,
            UInt64.fromUint(20000)
        );
        const signedTransaction = rich.sign(
            transferTransaction,
            process.env.GENERATION_HASH
        );
        transactionHttp.announce(signedTransaction);
        console.log(signedTransaction.hash);
        return signedTransaction.hash;
    });

    for (let i = 0; i < 1000; i++) {
        const txs = await accountHttp.outgoingTransactions(rich.address).toPromise()
        const distTxsConfirmed = txs.filter((tx) => {
            const index = distTxHashs.findIndex((a) => {
                return a === tx.transactionInfo.hash
            })
            return index > -1
        })
        if (distTxsConfirmed.length === 3) {
            break;
        }
        console.log("waiting distribution transaction confirmed");
        await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    

    // 1. Carol create cx0, then tell hcx0 to Alice
    const random = crypto.randomBytes(10);
    const cx0 = random.toString('hex').toUpperCase();
    const hasher = sha3_256.create();
    const hcx0 = hasher.update(random).hex().toUpperCase();
    console.log("1. Carol", "\n", cx0, "\n", hcx0)

    // 2. Alice lock to Bob
    const tx2 = SecretLockTransaction.create(
        Deadline.create(),
        new Mosaic(new NamespaceId('cat.currency'), UInt64.fromUint(1000000)),
        UInt64.fromUint(15000),
        HashType.Op_Sha3_256,
        hcx0,
        bob.address,
        NetworkType.MIJIN_TEST,
        UInt64.fromUint(100000)
    );
    const tx2Signed = alice.sign(tx2, process.env.GENERATION_HASH)
    transactionHttp.announce(tx2Signed)
    console.log("2. Alice", tx2Signed.hash)
    for (let i = 0; i < 1000; i++) {
        const txs = await accountHttp.outgoingTransactions(alice.address).toPromise()
        if (txs.findIndex((x) => x.transactionInfo.hash === tx2Signed.hash) > -1) {
            break;
        }
        console.log("waiting Alice transaction confirmed");
        await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    // 3-1. Bob lock to Carol
    const tx31 = SecretLockTransaction.create(
        Deadline.create(),
        new Mosaic(new NamespaceId('cat.currency'), UInt64.fromUint(1000000)),
        UInt64.fromUint(10000),
        HashType.Op_Sha3_256,
        hcx0,
        carol.address,
        NetworkType.MIJIN_TEST,
        UInt64.fromUint(100000)
    );
    const tx31Signed = bob.sign(tx31, process.env.GENERATION_HASH)
    transactionHttp.announce(tx31Signed)
    console.log("3-1. Bob", tx31Signed.hash)
    for (let i = 0; i < 1000; i++) {
        const txs = await accountHttp.outgoingTransactions(bob.address).toPromise()
        if (txs.findIndex((x) => x.transactionInfo.hash === tx31Signed.hash) > -1) {
            break;
        }
        console.log("waiting Bob transaction confirmed");
        await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    // 3-2. Carol unlock
    const tx32 = SecretProofTransaction.create(
        Deadline.create(),
        HashType.Op_Sha3_256,
        hcx0,
        carol.address,
        cx0,
        NetworkType.MIJIN_TEST,
        UInt64.fromUint(100000)
    );
    const tx32Signed = carol.sign(tx32, process.env.GENERATION_HASH)
    transactionHttp.announce(tx32Signed)
    console.log("3-2. Carol", tx32Signed.hash)
    for (let i = 0; i < 1000; i++) {
        const txs = await accountHttp.outgoingTransactions(carol.address).toPromise()
        if (txs.findIndex((x) => x.transactionInfo.hash === tx32Signed.hash) > -1) {
            break;
        }
        console.log("waiting Carol transaction confirmed");
        await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    // 4. Bob unlock
    const tx4 = SecretProofTransaction.create(
        Deadline.create(),
        HashType.Op_Sha3_256,
        hcx0,
        bob.address,
        cx0,
        NetworkType.MIJIN_TEST,
        UInt64.fromUint(100000)
    );
    const tx4Signed = bob.sign(tx4, process.env.GENERATION_HASH)
    transactionHttp.announce(tx4Signed)
    console.log("4. Bob", tx4Signed.hash)
    for (let i = 0; i < 1000; i++) {
        const txs = await accountHttp.outgoingTransactions(bob.address).toPromise()
        if (txs.findIndex((x) => x.transactionInfo.hash === tx4Signed.hash) > -1) {
            break;
        }
        console.log("waiting Bob transaction confirmed");
        await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    console.log("done")
}

exec();
