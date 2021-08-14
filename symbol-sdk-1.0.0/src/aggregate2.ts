import { sign } from "node:crypto";
import { 
    Account,
    Address,
    AggregateTransaction,
    AggregateTransactionCosignature,
    Convert,
    CosignatureSignedTransaction,
    CosignatureTransaction,
    Deadline,
    LinkAction,
    Message,
    Mosaic,
    MosaicDefinitionTransaction,
    MosaicFlags,
    MosaicId,
    MosaicNonce,
    MosaicSupplyChangeAction,
    MosaicSupplyChangeTransaction,
    NetworkCurrencies,
    NetworkType,
    NodeKeyLinkTransaction,
    PlainMessage,
    PublicAccount,
    RepositoryFactoryHttp,
    SignedTransaction,
    TransactionAnnounceResponse,
    TransactionHttp,
    TransactionRepository,
    TransferTransaction,
    UInt64,
    VrfKeyLinkTransaction,
} from "symbol-sdk";

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
    
    const account1: Account = Account.createFromPrivateKey(privateKey, nt);
    const account2: Account = Account.createFromPrivateKey(`3${privateKey.substr(1)}`, nt);
    
    const tx1: TransferTransaction = TransferTransaction.create(
        Deadline.create(ea),
        Address.createFromRawAddress(toAddress),
        [new Mosaic(nc.currency.unresolvedMosaicId, UInt64.fromNumericString(amount))],
        PlainMessage.create(message),
        nt,
        UInt64.fromUint(100000)
    );
    
    const tx2: TransferTransaction = TransferTransaction.create(
        Deadline.create(ea),
        Address.createFromRawAddress(toAddress),
        [new Mosaic(nc.currency.unresolvedMosaicId, UInt64.fromNumericString(amount))],
        PlainMessage.create(message),
        nt,
        UInt64.fromUint(100000)
    );

    const tx: AggregateTransaction = AggregateTransaction.createComplete(
        Deadline.create(ea),
        [
            tx1.toAggregate(account1.publicAccount),
            tx2.toAggregate(account2.publicAccount)
        ],
        nt,
        [],
        UInt64.fromUint(200000),
    )

    const signedTx1: SignedTransaction = account1.signTransactionWithCosignatories(tx, [account2], gh)
    const payload1: string = signedTx1.payload
    const agTx1: AggregateTransaction = AggregateTransaction.createFromPayload(payload1)

    const signedTx2: SignedTransaction = account1.sign(tx, gh);
    const agTx2: AggregateTransaction = AggregateTransaction.createFromPayload(signedTx2.payload)
    const cosignedTx2: CosignatureSignedTransaction = CosignatureTransaction.signTransactionPayload(account2, signedTx2.payload, gh)
    const co2: AggregateTransactionCosignature = new AggregateTransactionCosignature(
        cosignedTx2.signature, account2.publicAccount)
    agTx2.addCosignatures([co2])
    const payload2: string = agTx2.serialize()

    console.log(signedTx1)
    console.log(signedTx2)
    console.log(co2)

    // const th: TransactionRepository = factory.createTransactionRepository();
    // const res: TransactionAnnounceResponse = await th.announce(signedTx).toPromise();
}

main();