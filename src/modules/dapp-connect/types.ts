import {
  IRequestAccountResp,
  IRequestPayload,
  IRequestSignPayload,
  IRequestSignResp,
  IRequestSignMessagePayload,
  IRequestSignMessageResp,
  IRequestKeyResp,
} from '../../interfaces/connect';

interface IDappConnect {
  requestAccount: (req: IRequestPayload) => Promise<IRequestAccountResp>;
  requestSign: (req: IRequestSignPayload) => Promise<IRequestSignResp>;
  requestSignMessage: (req: IRequestSignMessagePayload) => Promise<IRequestSignMessageResp>;
  requestKey: (req: IRequestPayload) => Promise<IRequestKeyResp>;
  cancelRequest: () => void;

  getResultAccount: (requestID: string) => Promise<IRequestAccountResp>;
  getResultSign: (requestID: string) => Promise<IRequestSignResp>;
  getCurrentURL: () => string;
}

export { IDappConnect };
