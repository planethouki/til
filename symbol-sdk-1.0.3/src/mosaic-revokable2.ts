import {
    Account,
    Address, AggregateTransaction,
    Deadline,
    LinkAction,
    Message,
    Mosaic, MosaicDefinitionTransaction, MosaicFlags,
    MosaicId,
    MosaicNonce, MosaicSupplyChangeAction, MosaicSupplyChangeTransaction, MosaicSupplyRevocationTransaction,
    NetworkCurrencies,
    NetworkType,
    NodeKeyLinkTransaction,
    PlainMessage,
    RepositoryFactoryHttp,
    TransactionAnnounceResponse,
    TransactionHttp,
    TransactionRepository,
    TransferTransaction,
    UInt64,
    VrfKeyLinkTransaction
} from "symbol-sdk";


require('dotenv').config();

const nodeUrl: string = process.env.NODE_URL || "";
const privateKey: string = process.env.PRIVATE_KEY || "";
const mosaicId: string = process.env.REVOKE_MOSAIC_ID || "";
const fromAddress: string = process.env.REVOKE_ADDRESS || "";

if (nodeUrl === "" || privateKey === "" || mosaicId === "" || fromAddress === "") {
    throw new Error("node url or private key is invalid");
}

const main = async () => {

    const factory = new RepositoryFactoryHttp(nodeUrl);

    const ea: number = await factory.getEpochAdjustment().toPromise();
    const gh: string = await factory.getGenerationHash().toPromise();
    const nt: NetworkType = await factory.getNetworkType().toPromise();

    const account: Account = Account.createFromPrivateKey(privateKey, nt);

    const tx = MosaicSupplyRevocationTransaction.create(
        Deadline.create(ea),
        Address.createFromRawAddress(fromAddress),
        new Mosaic(new MosaicId(mosaicId), UInt64.fromUint(10)),
        nt,
        UInt64.fromUint(1000000)
    );

    const signedTx = account.sign(tx, gh);

    const th: TransactionRepository = factory.createTransactionRepository();
    const res: TransactionAnnounceResponse = await th.announce(signedTx).toPromise();
    console.log(res.message);
    console.log(signedTx.hash);
}

main();
