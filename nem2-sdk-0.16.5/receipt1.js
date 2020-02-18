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
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var receiptHttp, statements, transactionStatements, receiptHash0, statementVersion, statementType, statemenetSource, receipt0, receipt1, manualReceiptHash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                receiptHttp = new nem2_sdk_1.ReceiptHttp('https://jp5.nemesis.land:3001', nem2_sdk_1.NetworkType.TEST_NET);
                return [4 /*yield*/, receiptHttp.getBlockReceipts(nem2_sdk_1.UInt64.fromUint(2)).toPromise()];
            case 1:
                statements = _a.sent();
                transactionStatements = statements.transactionStatements;
                receiptHash0 = transactionStatements[0].generateHash();
                console.log(receiptHash0);
                statementVersion = '0100';
                statementType = '43e1';
                statemenetSource = '0000000000000000';
                receipt0 = '01004321a84582052890a95139d2b80500000000c151a3a63e7aff6bdb78bf40e8a78c772ddb36e2306401771b0bfdcd4dd3b787';
                receipt1 = '01004351a84582052890a95139d2b80500000000';
                manualReceiptHash = hash(statementVersion +
                    statementType +
                    statemenetSource +
                    receipt0 +
                    receipt1);
                console.log(manualReceiptHash);
                console.log(manualReceiptHash.toUpperCase() === receiptHash0);
                return [2 /*return*/];
        }
    });
}); })();
function hash(hex) {
    var hasher = js_sha3_1.sha3_256.create();
    return hasher.update(Buffer.from(hex, 'hex')).hex();
}
