import {BlockRepository, RepositoryFactoryHttp, UInt64} from "nem2-sdk";
import {sha3_256} from "js-sha3";

const validateTransactionInBlock = async (leaf: string, height: UInt64, blockHttp: BlockRepository) => {
        // 1.Calculate H(B) (leaf)
        // 2. Obtain HRoot; in Symbol, this is stored in the block header.
        const HRoot = (await blockHttp.getBlockByHeight(height).toPromise()).blockTransactionsHash;
        console.log('Hroot', HRoot);
        // 3. Request merkle path H(A), HCD, HEE2.
        const merklePath = (await blockHttp.getMerkleTransaction(height, leaf).toPromise()).merklePath;
        // 4. Calculate HRoot0 = H(H(H(H(A), H(B)), HCD), HEE2).
        if (merklePath.length === 0) {
                // Single item tree, so leaf = HRoot0
                return leaf.toUpperCase() === HRoot.toUpperCase();
        }
        const HRoot0 = merklePath
            .reduce( (proofHash, pathItem) => {
                const hasher = sha3_256.create();
                // left
                if (pathItem.position === 1){
                    return hasher.update(Buffer.from(pathItem.hash + proofHash, 'hex')).hex();
                }
                // right
                else {
                    return hasher.update(Buffer.from(proofHash + pathItem.hash, 'hex')).hex();
                }
            }, leaf);
        console.log('Hroot0', HRoot0);
        // 5. Compare HRoot and HRoot0; if they match H(B) must be stored in the tree.
        return HRoot.toUpperCase() === HRoot0.toUpperCase();
};

const nodeUrl = 'http://api-xym-3-01.ap-northeast-1.nemtech.network:3000';
const repositoryHttp = new RepositoryFactoryHttp(nodeUrl);
const blockHttp = repositoryHttp.createBlockRepository();
// replace with block height
const height = UInt64.fromUint(1);
// replace with transaction hash to check if included in block
const leaf = '1F4B55D42C9C91805E73317319DDDA633667D5E44EB0F03678FF7F130555DF4B'.toLowerCase();
validateTransactionInBlock(leaf, height, blockHttp).then(result => console.log(result));