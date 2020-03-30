import {
    Account,
    AccountMetadataTransaction,
    Convert,
    Deadline,
    NetworkType,
    KeyGenerator,
    KeyPair,
    SHA3Hasher,
} from "nem2-sdk";

interface IKeyPair {
    privateKey: Uint8Array;
    publicKey: Uint8Array;
}

let privateKey = "E4E48DAF7CC2F7E99818490D4F3DB9D14D7D58078D59FC99DB6B944A098BF9BC";
let metadataKey = "";
let metadataValue = "";

const networkType = NetworkType.TEST_NET;
const account = Account.createFromPrivateKey(privateKey, networkType);
const targetPublicKey = account.publicKey;

const accountMetadataTransaction = AccountMetadataTransaction.create(
        Deadline.create(),
        targetPublicKey,
        KeyGenerator.generateUInt64Key(metadataKey),
        metadataValue.length,
        metadataValue,
        networkType
);
