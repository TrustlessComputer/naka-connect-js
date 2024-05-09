import { IRequestAccountResp, IRequestSignPayload, IRequestSignResp, IRequestPayload, IRequestSignMessagePayload, IRequestSignMessageResp } from '../../interfaces/connect';
import { IDappConnect } from './types';
declare class DappConnect implements IDappConnect {
    private axios;
    private currentRequestID?;
    private currentURL?;
    private walletURL;
    constructor(baseURL?: string, walletURL?: string);
    getHost: () => string;
    getResultAccount: (requestID: string) => Promise<IRequestAccountResp>;
    getResultSign: (requestID: string) => Promise<IRequestSignResp>;
    requestAccount: (payload: IRequestPayload) => Promise<IRequestAccountResp>;
    requestSign: ({ isExecuteTransaction, ...rest }: IRequestSignPayload) => Promise<IRequestSignResp>;
    requestSignMessage: (payload: IRequestSignMessagePayload) => Promise<IRequestSignMessageResp>;
    cancelRequest: () => void;
    getCurrentURL: () => string;
    private generateRequestId;
    private request;
}
export { DappConnect };
