import axios, { AxiosInstance } from 'axios';
import Configs from '../../constants/configs';
import {
  IRequestAccountResp, IRequestSignMessageResp,
  IRequestSignResp,
  IResultConnectResp,
} from '../../interfaces/connect';
import { sleep } from '../../utils';
import { IWalletConnect } from './types';

class WalletConnect implements IWalletConnect {
  private axios: AxiosInstance;
  private currentRequestID?: string;

  constructor(baseURL?: string, requestID?: string) {

    this.axios = axios.create({
      baseURL: (baseURL || Configs.BASE_URL) + '/api/wallets',
    });

    this.currentRequestID = requestID;
  }

  getRequest = async (requestID: string): Promise<IResultConnectResp> => {
    this.currentRequestID = requestID;
    return await this.listen(requestID);
  };

  cancelGetRequest = () => {
    this.currentRequestID = undefined;
  };

  postResultAccount = async (result: IRequestAccountResp) => {
    return await this.postResult(result);
  };

  postResultSign = async (result: IRequestSignResp) => {
    return await this.postResult(result);
  };

  postResultSignMessage = async (result: IRequestSignMessageResp) => {
    return await this.postResult(result);
  };

  private listen = async (requestID: string) => {
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
        console.log('listen wallet: ', res)
        // sleep 2s
        if (!res) {
          await sleep(3000);
        }
      } catch (error) {
        counter++;
        if (counter === 4) {
          throw new Error(`Can not get request ${requestID}.`)
        }
        // sleep 2s
        await sleep(3000);
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

  private postResult = async (result: any) => {
    try {
      if (this.currentRequestID) {
        // post request
        return await this.axios.post('/data', {
          id: `${this.currentRequestID}${Configs.LISTEN_SUFFIX}`,
          data: JSON.stringify(result),
        });
      } else {
        throw new Error('Invalid request id');
      }
    } catch (error) {
      throw error;
    }
  };
}

export { WalletConnect };
