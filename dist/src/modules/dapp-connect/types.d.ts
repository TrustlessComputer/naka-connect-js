import { IRequestAccountResp, IRequestPayload, IRequestSignPayload, IRequestSignResp, IRequestSignMessagePayload, IRequestSignMessageResp, IRequestKeyResp, IRequestSignV4Resp, IRequestSignV4Payload } from '../../interfaces/connect';
interface IDappConnect {
    requestAccount: (req: IRequestPayload) => Promise<IRequestAccountResp>;
    requestSign: (req: IRequestSignPayload) => Promise<IRequestSignResp>;
    requestSignMessage: (req: IRequestSignMessagePayload) => Promise<IRequestSignMessageResp>;
    requestKey: (req: IRequestPayload) => Promise<IRequestKeyResp>;
    requestSignV4: (req: IRequestSignV4Payload) => Promise<IRequestSignV4Resp>;
    cancelRequest: () => void;
    getResultAccount: (requestID: string) => Promise<IRequestAccountResp>;
    getResultSign: (requestID: string) => Promise<IRequestSignResp>;
    getCurrentURL: () => string;
}
export { IDappConnect };
