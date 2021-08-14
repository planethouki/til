import { sign } from "node:crypto";
import { 
    Account,
    Address,
    AggregateTransaction,
    Convert,
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
    
    const account: Account = Account.createFromPrivateKey(privateKey, nt);
    
    const tx1: TransferTransaction = TransferTransaction.create(
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
          tx1.toAggregate(account.publicAccount)
        ],
        nt,
        [],
        UInt64.fromUint(200000),
    )


    const signedTx = account.sign(tx, gh);
    
    const generationHashBytes = Array.from(Convert.hexToUint8(gh))
    const payloadBytes = Array.from(Convert.hexToUint8(signedTx.payload))
    const signingHex = Convert.uint8ToHex(tx.getSigningBytes(payloadBytes, generationHashBytes))
    console.log(signingHex)

    console.log(signedTx);

    const th: TransactionRepository = factory.createTransactionRepository();
    const res: TransactionAnnounceResponse = await th.announce(signedTx).toPromise();
}

main();