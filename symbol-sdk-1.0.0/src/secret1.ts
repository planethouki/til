import {
    Account,
    Address,
    Deadline,
    LockHashAlgorithm,
    Mosaic,
    NetworkCurrencies,
    NetworkType,
    PlainMessage,
    RepositoryFactoryHttp,
    SecretLockTransaction, SecretProofTransaction,
    TransactionAnnounceResponse,
    TransactionRepository,
    UInt64
} from "symbol-sdk";

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

const nodeUrl: string = process.env.NODE_URL || "";
const privateKey: string = process.env.PRIVATE_KEY || "";
const toAddress: string = process.env.TO_ADDRESS || "";
const amount: string = process.env.AMOUNT || "";

if (nodeUrl === "" || privateKey === "" || toAddress === "" || amount === "") {
    throw new Error("node url or private key is invalid");
}

const main = async () => {

    const factory = new RepositoryFactoryHttp(nodeUrl);

    const ea: number = await factory.getEpochAdjustment().toPromise();
    const gh: string = await factory.getGenerationHash().toPromise();
    const nt: NetworkType = await factory.getNetworkType().toPromise();
    const nc: NetworkCurrencies = await factory.getCurrencies().toPromise();

    // const tx: SecretLockTransaction = SecretLockTransaction.create(
    //     Deadline.create(ea),
    //     new Mosaic(nc.currency.unresolvedMosaicId, UInt64.fromNumericString(amount)),
    //     UInt64.fromUint(240),
    //     LockHashAlgorithm.Op_Hash_256,
    //     "A9AADA95ED0A103FA2BEA014FD8BC03FD0614D45C1749EB5E957DE7E845E36E3",
    //     Address.createFromRawAddress(toAddress),
    //     nt,
    //     UInt64.fromUint(100000)
    // );

    const tx: SecretProofTransaction = SecretProofTransaction.create(
        Deadline.create(ea),
        LockHashAlgorithm.Op_Hash_256,
        "A9AADA95ED0A103FA2BEA014FD8BC03FD0614D45C1749EB5E957DE7E845E36E3",
        Address.createFromRawAddress(toAddress),
        "E93D36F234F8CCAD92F3FAADB3806A0A7F4F185C",
        nt,
        UInt64.fromUint(100000)
    );

    const account: Account = Account.createFromPrivateKey(privateKey, nt);
    const signedTx = account.sign(tx, gh);

    const th: TransactionRepository = factory.createTransactionRepository();
    const res: TransactionAnnounceResponse = await th.announce(signedTx).toPromise();
    // tslint:disable-next-line:no-console
    console.log(res.message);
    // tslint:disable-next-line:no-console
    console.log(signedTx.hash);
}

main();
