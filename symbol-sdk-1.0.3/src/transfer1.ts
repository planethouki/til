import { Account, Address, Deadline, LinkAction, Message, Mosaic, MosaicId, NetworkCurrencies, NetworkType, NodeKeyLinkTransaction, PlainMessage, RepositoryFactoryHttp, TransactionAnnounceResponse, TransactionHttp, TransactionRepository, TransferTransaction, UInt64, VrfKeyLinkTransaction } from "symbol-sdk";

require('dotenv').config();

const nodeUrl: string = process.env.NODE_URL || "";
const privateKey: string = process.env.PRIVATE_KEY || "";
const toAddress: string = process.env.TO_ADDRESS || "";
const amount: string = process.env.AMOUNT || "";
const message: string = process.env.MESSAGE || "";

if (nodeUrl === "" || privateKey === "" || toAddress === "" || amount === "") {
    throw new Error("node url or private key is invalid");
}

const main = async () => {

    const factory = new RepositoryFactoryHttp(nodeUrl);

    const ea: number = await factory.getEpochAdjustment().toPromise();
    const gh: string = await factory.getGenerationHash().toPromise();
    const nt: NetworkType = await factory.getNetworkType().toPromise();
    const nc: NetworkCurrencies = await factory.getCurrencies().toPromise();

    const tx: TransferTransaction = TransferTransaction.create(
        Deadline.create(ea),
        Address.createFromRawAddress(toAddress),
        [new Mosaic(nc.currency.unresolvedMosaicId, UInt64.fromNumericString(amount))],
        PlainMessage.create(message),
        nt,
        UInt64.fromUint(100000)
    );

    const account: Account = Account.createFromPrivateKey(privateKey, nt);
    const signedTx = account.sign(tx, gh);

    const th: TransactionRepository = factory.createTransactionRepository();
    const res: TransactionAnnounceResponse = await th.announce(signedTx).toPromise();
    console.log(res.message);
    console.log(signedTx.hash);
}

main();
