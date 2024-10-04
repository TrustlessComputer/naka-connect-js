import { IRequestAccountResp, IRequestKeyResp, IRequestSignMessageResp, IRequestSignResp, IResultConnectResp, IRequestSignV4Resp } from '../../interfaces/connect';
import { IWalletConnect } from './types';
declare class WalletConnect implements IWalletConnect {
    private axios;
    private currentRequestID?;
    constructor(baseURL?: string, requestID?: string);
    getRequest: (requestID: string) => Promise<IResultConnectResp>;
    cancelGetRequest: () => void;
    postResultAccount: (result: IRequestAccountResp) => Promise<import("axios").AxiosResponse<any, any>>;
    postResultSign: (result: IRequestSignResp) => Promise<import("axios").AxiosResponse<any, any>>;
    postResultRequestKey: (result: IRequestKeyResp) => Promise<import("axios").AxiosResponse<any, any>>;
    postResultSignMessage: (result: IRequestSignMessageResp) => Promise<import("axios").AxiosResponse<any, any>>;
    postResultSignV4: (result: IRequestSignV4Resp) => Promise<import("axios").AxiosResponse<any, any>>;
    private listen;
    private postResult;
}
export { WalletConnect };
