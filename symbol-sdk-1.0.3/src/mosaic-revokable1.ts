import {
    Account,
    Address, AggregateTransaction,
    Deadline,
    LinkAction,
    Message,
    Mosaic, MosaicDefinitionTransaction, MosaicFlags,
    MosaicId,
    MosaicNonce, MosaicSupplyChangeAction, MosaicSupplyChangeTransaction,
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

if (nodeUrl === "" || privateKey === "") {
    throw new Error("node url or private key is invalid");
}

const main = async () => {

    const factory = new RepositoryFactoryHttp(nodeUrl);

    const ea: number = await factory.getEpochAdjustment().toPromise();
    const gh: string = await factory.getGenerationHash().toPromise();
    const nt: NetworkType = await factory.getNetworkType().toPromise();

    const account: Account = Account.createFromPrivateKey(privateKey, nt);

    const duration = UInt64.fromUint(1000);
    const isSupplyMutable = true;
    const isTransferable = true;
    const isRestrictable = true;
    const isRevokable = true;

    const divisibility = 0;

    const nonce = MosaicNonce.createRandom();
    const txd = MosaicDefinitionTransaction.create(
        Deadline.create(ea),
        nonce,
        MosaicId.createFromNonce(nonce, account.address),
        MosaicFlags.create(isSupplyMutable, isTransferable, isRestrictable, isRevokable),
        divisibility,
        duration,
        nt,
    );

    const delta = 1000000;

    const txs = MosaicSupplyChangeTransaction.create(
        Deadline.create(ea),
        txd.mosaicId,
        MosaicSupplyChangeAction.Increase,
        UInt64.fromUint(delta * Math.pow(10, divisibility)),
        nt,
    );

    const txa = AggregateTransaction.createComplete(
        Deadline.create(ea),
        [
            txd.toAggregate(account.publicAccount),
            txs.toAggregate(account.publicAccount),
        ],
        nt,
        [],
        UInt64.fromUint(2000000),
    );

    const signedTx = account.sign(txa, gh);

    const th: TransactionRepository = factory.createTransactionRepository();
    const res: TransactionAnnounceResponse = await th.announce(signedTx).toPromise();
    console.log(txd.mosaicId.id.toHex());
    console.log(res.message);
    console.log(signedTx.hash);
}

main();
