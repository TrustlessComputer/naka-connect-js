enum RequestMethod {
  account = 'account',
  sign = 'sign-transaction',
  signMessage = "sign-message",
}

// Base connect resp
interface IRequestConnectResp {
  method: RequestMethod;
  isReject?: boolean;
  errMsg?: string;
}

// Request account

interface IAccount {
  address: string;
  authToken?: string;
}

interface IRequestAccountResp extends IRequestConnectResp {
  accounts: IAccount[];
  signature?: string
}

interface IRequestSignMessageResp extends IRequestAccountResp {
  signature: string;
}

type Target = "_blank" | "_parent" | "_self" | "_top" | 'popup';
type IChainType = "NAKA" | "RUNE" | "EAI" | string;

interface IRequestPayload {
  target: Target
  popupSize?: string;
  redirectURL?: string;
  signMessage?: string;
  callback?: () => string;
}

interface IRequestSignMessagePayload extends IRequestPayload {
  fromAddress: string;
  signMessage: string;
}

// Request sign
interface IRequestSignPayload extends IRequestPayload {
  calldata: string;
  functionName?: string; // Approve
  functionType?: string; // approve(address,uint256)
  gasPrice?: string;
  gasLimit?: string;
  from?: string;
  to?: string;
  value?: string;
  nonce?: number | string;
  isExecuteTransaction?: boolean;
  chainType: IChainType,
  accountAbstraction?: {
    paymasterAddress: string;
    tokenAddress: string;
    tokenFeeAddress: string;
  };
  rawTx?: any;
}

interface IRequestSignResp extends IRequestConnectResp {
  hash: string;
  nonce?: number;
  to?: string;
  from?: string;
}

export {
  RequestMethod,
  IRequestConnectResp,
  IRequestAccountResp,
  IRequestSignMessageResp,
  IRequestSignPayload,
  IRequestSignResp,
  IRequestPayload,
  IRequestSignMessagePayload,
};

// Result resp
interface IResultConnectBase {
  method: RequestMethod,
  host: string;
  id: string;
}

type IResultConnectResp = IResultConnectBase & IRequestSignPayload & IRequestSignMessagePayload;

export { IResultConnectResp };
