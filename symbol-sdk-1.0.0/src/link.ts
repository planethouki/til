import { Account, AccountKeyLinkTransaction, Deadline, LinkAction, NetworkType, NodeKeyLinkTransaction, RepositoryFactoryHttp, TransactionAnnounceResponse, TransactionHttp, TransactionRepository, UInt64, VrfKeyLinkTransaction } from "symbol-sdk";

require('dotenv').config();

const nodeUrl: string = process.env.NODE_URL || "";
const privateKey: string = process.env.PRIVATE_KEY || "";
const linkedPublicKey: string = process.env.LINK_PUBLIC_KEY || "";

if (nodeUrl === "" || privateKey === "" || linkedPublicKey === "") {
    throw new Error("node url or private key is invalid");
}

const main = async () => {

    const factory = new RepositoryFactoryHttp(nodeUrl);

    const ea: number = await factory.getEpochAdjustment().toPromise();
    const gh: string = await factory.getGenerationHash().toPromise();
    const nt: NetworkType = await factory.getNetworkType().toPromise();
    
    // const tx: NodeKeyLinkTransaction = NodeKeyLinkTransaction.create(
    //     Deadline.create(ea),
    //     linkedPublicKey,
    //     LinkAction.Link,
    //     nt,
    //     UInt64.fromUint(100000)
    // );
    const tx: VrfKeyLinkTransaction = VrfKeyLinkTransaction.create(
        Deadline.create(ea),
        linkedPublicKey,
        LinkAction.Unlink,
        nt,
        UInt64.fromUint(100000)
    );
    // const tx: AccountKeyLinkTransaction = AccountKeyLinkTransaction.create(
    //     Deadline.create(ea),
    //     linkedPublicKey,
    //     LinkAction.Link,
    //     nt,
    //     UInt64.fromUint(100000)
    // );

    const account: Account = Account.createFromPrivateKey(privateKey, nt);
    const signedTx = account.sign(tx, gh);

    const th: TransactionRepository = factory.createTransactionRepository();
    const res: TransactionAnnounceResponse = await th.announce(signedTx).toPromise();
    console.log(res.message);
}

main();