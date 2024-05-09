"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnect = void 0;
const axios_1 = __importDefault(require("axios"));
const configs_1 = __importDefault(require("../../constants/configs"));
const utils_1 = require("../../utils");
class WalletConnect {
    constructor(baseURL, requestID) {
        this.getRequest = async (requestID) => {
            this.currentRequestID = requestID;
            return await this.listen(requestID);
        };
        this.cancelGetRequest = () => {
            this.currentRequestID = undefined;
        };
        this.postResultAccount = async (result) => {
            return await this.postResult(result);
        };
        this.postResultSign = async (result) => {
            return await this.postResult(result);
        };
        this.postResultSignMessage = async (result) => {
            return await this.postResult(result);
        };
        this.listen = async (requestID) => {
            let nakaConnectRes;
            let counter = 0;
            while (true) {
                // remove old listen
                if (this.currentRequestID !== requestID) {
                    break;
                }
                // handle get data from dapp
                let res;
                try {
                    res = await this.axios.get(`/data?id=${requestID}`);
                    console.log('listen wallet: ', res);
                    // sleep 2s
                    if (!res) {
                        await (0, utils_1.sleep)(3000);
                    }
                }
                catch (error) {
                    counter++;
                    if (counter === 4) {
                        throw new Error(`Can not get request ${requestID}.`);
                    }
                    // sleep 2s
                    await (0, utils_1.sleep)(3000);
                    continue;
                }
                const resultData = res?.data?.result; // JSON string
                if (resultData) {
                    // check request id and data
                    if (resultData) {
                        const nakaRes = JSON.parse(resultData);
                        const host = nakaRes?.host;
                        const isExecuteTransaction = (nakaRes?.isExecuteTransaction === undefined) || (nakaRes?.isExecuteTransaction === null)
                            ? true
                            : nakaRes?.isExecuteTransaction;
                        if (nakaRes && nakaRes.method) {
                            nakaConnectRes = {
                                ...nakaRes,
                                host: host,
                                id: requestID,
                                isExecuteTransaction,
                            };
                            break;
                        }
                    }
                }
            }
            return nakaConnectRes;
        };
        this.postResult = async (result) => {
            try {
                if (this.currentRequestID) {
                    // post request
                    return await this.axios.post('/data', {
                        id: `${this.currentRequestID}${configs_1.default.LISTEN_SUFFIX}`,
                        data: JSON.stringify(result),
                    });
                }
                else {
                    throw new Error('Invalid request id');
                }
            }
            catch (error) {
                throw error;
            }
        };
        this.axios = axios_1.default.create({
            baseURL: (baseURL || configs_1.default.BASE_URL) + '/api/wallets',
        });
        this.currentRequestID = requestID;
    }
}
exports.WalletConnect = WalletConnect;
//# sourceMappingURL=walletConnect.js.map