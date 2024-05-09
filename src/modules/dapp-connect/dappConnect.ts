import axios, { AxiosInstance } from 'axios';
import {
  RequestMethod,
  IRequestAccountResp,
  IRequestSignPayload,
  IRequestSignResp,
  IRequestPayload, IRequestSignMessagePayload, IRequestSignMessageResp,
} from '../../interfaces/connect';
import Configs from '../../constants/configs';
import { sleep, generateUniqueID } from '../../utils';
import { IDappConnect } from './types';
import {isMobile} from "react-device-detect";

const SLEEP_TIME = 3000;
const COUNTER = 100;
const TIME_OUT = SLEEP_TIME * COUNTER;

class DappConnect implements IDappConnect {
  private axios: AxiosInstance;
  private currentRequestID?: string;
  private currentURL?: string;
  private walletURL = Configs.WALLET_URL;

  constructor(baseURL?: string, walletURL?: string) {
    this.axios = axios.create({
      baseURL: (baseURL || Configs.BASE_URL) + '/api/wallets',
    });

    if (walletURL) {
      this.walletURL = walletURL;
    }
  }

  getHost = (): string => {
    return window.location.host;
  }



  getResultAccount = async (requestID: string): Promise<IRequestAccountResp> => {
    try {
      this.currentRequestID = requestID;
      const account = await this.request(requestID, RequestMethod.account);
      return account;
    } catch (error) {
      throw error;
    }
  };

  getResultSign = async (requestID: string): Promise<IRequestSignResp> => {
    try {
      this.currentRequestID = requestID;
      const sign = await this.request(requestID, RequestMethod.sign);
      return sign;
    } catch (error) {
      throw error;
    }
  };

  requestAccount = async (payload: IRequestPayload): Promise<IRequestAccountResp> => {
    try {
      const requestID = this.generateRequestId(payload);

      // post request
      await this.axios.post('/data', {
        id: requestID,
        data: JSON.stringify({
          method: RequestMethod.account,
          id: requestID,
          host: this.getHost(),
          ...payload
        }),
      });
      await sleep(0.2);
      const account = await this.request(requestID, RequestMethod.account);
      return account;
    } catch (error) {
      throw error;
    }
  };

  requestSign = async ({ isExecuteTransaction = true, ...rest }: IRequestSignPayload): Promise<IRequestSignResp> => {
    try {
      const requestID = this.generateRequestId({ target: rest.target });

      // post request
      await this.axios.post('/data', {
        id: requestID,
        data: JSON.stringify({
          method: RequestMethod.sign,
          ...rest,
          isExecuteTransaction,
          id: requestID,
          host: this.getHost(),
        }),
      });
      await sleep(0.2);
      const sign = await this.request(requestID, RequestMethod.sign);
      return sign;
    } catch (error) {
      throw error;
    }
  };

  requestSignMessage = async (payload: IRequestSignMessagePayload): Promise<IRequestSignMessageResp> => {
    try {
      const requestID = this.generateRequestId(payload);

      // post request
      await this.axios.post('/data', {
        id: requestID,
        data: JSON.stringify({
          method: RequestMethod.signMessage,
          id: requestID,
          host: this.getHost(),
          ...payload,
        }),
      });
      await sleep(0.2);
      const resp = await this.request(requestID, RequestMethod.signMessage);
      return resp;
    } catch (error) {
      throw error;
    }
  };

  cancelRequest = () => {
    this.currentRequestID = undefined;
    this.currentURL = undefined;
  };

  getCurrentURL = () => {
    return this.currentURL || '';
  }

  private generateRequestId = (payload: IRequestPayload) => {
    const requestID = generateUniqueID();
    this.currentRequestID = requestID;

    // const expired = new Date().getTime() + TIME_OUT;

    const currentURL = `${this.walletURL.includes(window.location.host) ? '' : this.walletURL}?request=${requestID}`;

    this.currentURL = currentURL;

    if (payload.target === "popup" && !isMobile) {
      const width = 580;
      const height = 720;
      const leftPosition = (window.screen.width - width) / 2;
      const topPosition = (window.screen.height - height) / 2;
      window.open(currentURL, `naka-${requestID}`, payload?.popupSize || (`width=${width},height=${height},left=` + leftPosition + ",top=" + topPosition));
    } else {
      setTimeout(() => {
        window.open(currentURL, payload.target)
      }, 200);
    }
    return requestID;
  };

  private request = async (requestID: string, method: RequestMethod) => {
    let nakaConnectRes;
    let counter = 0;
    while (true) {
      // remove old request
      if (this.currentRequestID !== requestID) {
        break;
      }
      // sleep 3s
      await sleep(SLEEP_TIME);

      // handle get result from wallet
      let res;
      try {
        res = await this.axios.get(`/data?id=${requestID}${Configs.LISTEN_SUFFIX}`);
        console.log('listen dapp: ', res)
      } catch (error) {
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
        } else {
          throw new Error('Can not parse data.');
        }
      }
    }
    return nakaConnectRes;
  };
}

export { DappConnect };
