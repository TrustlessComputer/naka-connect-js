"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DappConnect = void 0;
const axios_1 = __importDefault(require("axios"));
const connect_1 = require("../../interfaces/connect");
const configs_1 = __importDefault(require("../../constants/configs"));
const utils_1 = require("../../utils");
const react_device_detect_1 = require("react-device-detect");
const SLEEP_TIME = 3000;
const COUNTER = 100;
const TIME_OUT = SLEEP_TIME * COUNTER;
class DappConnect {
    constructor(baseURL, walletURL) {
        this.walletURL = configs_1.default.WALLET_URL;
        this.getHost = () => {
            return window.location.host;
        };
        this.getResultAccount = async (requestID) => {
            try {
                this.currentRequestID = requestID;
                const account = await this.request(requestID, connect_1.RequestMethod.account);
                return account;
            }
            catch (error) {
                throw error;
            }
        };
        this.getResultSign = async (requestID) => {
            try {
                this.currentRequestID = requestID;
                const sign = await this.request(requestID, connect_1.RequestMethod.sign);
                return sign;
            }
            catch (error) {
                throw error;
            }
        };
        this.requestAccount = async (payload) => {
            try {
                const requestID = this.generateRequestId(payload);
                // post request
                await this.axios.post('/data', {
                    id: requestID,
                    data: JSON.stringify({
                        method: connect_1.RequestMethod.account,
                        id: requestID,
                        host: this.getHost(),
                        ...payload
                    }),
                });
                await (0, utils_1.sleep)(0.2);
                const account = await this.request(requestID, connect_1.RequestMethod.account);
                return account;
            }
            catch (error) {
                throw error;
            }
        };
        this.requestSign = async ({ isExecuteTransaction = true, ...rest }) => {
            try {
                const requestID = this.generateRequestId({ target: rest.target });
                // post request
                await this.axios.post('/data', {
                    id: requestID,
                    data: JSON.stringify({
                        method: connect_1.RequestMethod.sign,
                        ...rest,
                        isExecuteTransaction,
                        id: requestID,
                        host: this.getHost(),
                    }),
                });
                await (0, utils_1.sleep)(0.2);
                const sign = await this.request(requestID, connect_1.RequestMethod.sign);
                return sign;
            }
            catch (error) {
                throw error;
            }
        };
        this.requestSignMessage = async (payload) => {
            try {
                const requestID = this.generateRequestId(payload);
                // post request
                await this.axios.post('/data', {
                    id: requestID,
                    data: JSON.stringify({
                        method: connect_1.RequestMethod.signMessage,
                        id: requestID,
                        host: this.getHost(),
                        ...payload,
                    }),
                });
                await (0, utils_1.sleep)(0.2);
                const resp = await this.request(requestID, connect_1.RequestMethod.signMessage);
                return resp;
            }
            catch (error) {
                throw error;
            }
        };
        this.cancelRequest = () => {
            this.currentRequestID = undefined;
            this.currentURL = undefined;
        };
        this.getCurrentURL = () => {
            return this.currentURL || '';
        };
        this.generateRequestId = (payload) => {
            const requestID = (0, utils_1.generateUniqueID)();
            this.currentRequestID = requestID;
            // const expired = new Date().getTime() + TIME_OUT;
            const currentURL = `${this.walletURL.includes(window.location.host) ? '' : this.walletURL}?request=${requestID}`;
            this.currentURL = currentURL;
            if (payload.target === "popup" && !react_device_detect_1.isMobile) {
                const width = 580;
                const height = 720;
                const leftPosition = (window.screen.width - width) / 2;
                const topPosition = (window.screen.height - height) / 2;
                window.open(currentURL, `naka-${requestID}`, payload?.popupSize || (`width=${width},height=${height},left=` + leftPosition + ",top=" + topPosition));
            }
            else {
                setTimeout(() => {
                    window.open(currentURL, payload.target);
                }, 200);
            }
            return requestID;
        };
        this.request = async (requestID, method) => {
            let nakaConnectRes;
            let counter = 0;
            while (true) {
                // remove old request
                if (this.currentRequestID !== requestID) {
                    break;
                }
                // sleep 3s
                await (0, utils_1.sleep)(SLEEP_TIME);
                // handle get result from wallet
                let res;
                try {
                    res = await this.axios.get(`/data?id=${requestID}${configs_1.default.LISTEN_SUFFIX}`);
                    console.log('listen dapp: ', res);
                }
                catch (error) {
                    counter++;
                    // 5 mins, sleep 3s
                    if (counter === COUNTER) {
                        throw new Error(`Timeout.`);
                    }
                    continue;
                }
                const resultData = res?.data?.result; // JSON string
                if (resultData) {
                    const nakaRes = JSON.parse(resultData);
                    // check equal request id and has data
                    if (requestID && resultData) {
                        if (nakaRes && nakaRes.method === method) {
                            if (nakaRes.errMsg) {
                                throw new Error(nakaRes.errMsg);
                            }
                            nakaConnectRes = nakaRes;
                            break;
                        }
                    }
                    else {
                        throw new Error('Can not parse data.');
                    }
                }
            }
            return nakaConnectRes;
        };
        this.axios = axios_1.default.create({
            baseURL: (baseURL || configs_1.default.BASE_URL) + '/api/wallets',
        });
        if (walletURL) {
            this.walletURL = walletURL;
        }
    }
}
exports.DappConnect = DappConnect;
//# sourceMappingURL=dappConnect.js.map