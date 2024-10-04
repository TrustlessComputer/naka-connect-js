import {
  IRequestAccountResp,
  IRequestSignMessageResp,
  IRequestSignResp,
  IResultConnectResp,
  IRequestKeyResp,
  IRequestSignV4Resp
} from '../../interfaces/connect';

interface IWalletConnect {
  getRequest: (requestID: string) => Promise<IResultConnectResp>;
  cancelGetRequest: () => void;
  postResultAccount: (result: IRequestAccountResp) => void;
  postResultSign: (result: IRequestSignResp) => void;
  postResultSignMessage: (result: IRequestSignMessageResp) => void;
  postResultRequestKey: (result: IRequestKeyResp) => void;
  postResultSignV4: (result: IRequestSignV4Resp) => void;
}

export { IWalletConnect };
