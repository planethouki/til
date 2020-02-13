"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var nem2_sdk_1 = require("nem2-sdk");
var js_sha3_1 = require("js-sha3");
var validateTransactionInBlock = function (leaf, height, blockHttp) { return __awaiter(void 0, void 0, void 0, function () {
    var HRoot, merklePath, HRoot0;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, blockHttp.getBlockByHeight(height).toPromise()];
            case 1:
                HRoot = (_a.sent()).blockTransactionsHash;
                console.log('Hroot', HRoot);
                return [4 /*yield*/, blockHttp.getMerkleTransaction(height, leaf).toPromise()];
            case 2:
                merklePath = (_a.sent()).merklePath;
                // 4. Calculate HRoot0 = H(H(H(H(A), H(B)), HCD), HEE2).
                if (merklePath.length === 0) {
                    // Single item tree, so leaf = HRoot0
                    return [2 /*return*/, leaf.toUpperCase() === HRoot.toUpperCase()];
                }
                HRoot0 = merklePath
                    .reduce(function (proofHash, pathItem) {
                    var hasher = js_sha3_1.sha3_256.create();
                    // left
                    if (pathItem.position === 1) {
                        return hasher.update(Buffer.from(pathItem.hash + proofHash, 'hex')).hex();
                    }
                    // right
                    else {
                        return hasher.update(Buffer.from(proofHash + pathItem.hash, 'hex')).hex();
                    }
                }, leaf);
                console.log('Hroot0', HRoot0);
                // 5. Compare HRoot and HRoot0; if they match H(B) must be stored in the tree.
                return [2 /*return*/, HRoot.toUpperCase() === HRoot0.toUpperCase()];
        }
    });
}); };
var nodeUrl = 'http://api-xym-3-01.ap-northeast-1.nemtech.network:3000';
var repositoryHttp = new nem2_sdk_1.RepositoryFactoryHttp(nodeUrl);
var blockHttp = repositoryHttp.createBlockRepository();
// replace with block height
var height = nem2_sdk_1.UInt64.fromUint(1);
// replace with transaction hash to check if included in block
var leaf = '1F4B55D42C9C91805E73317319DDDA633667D5E44EB0F03678FF7F130555DF4B'.toLowerCase();
validateTransactionInBlock(leaf, height, blockHttp).then(function (result) { return console.log(result); });
