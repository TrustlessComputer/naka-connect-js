declare enum RequestMethod {
    account = "account",
    sign = "sign-transaction",
    signMessage = "sign-message"
}
interface IRequestConnectResp {
    method: RequestMethod;
    isReject?: boolean;
    errMsg?: string;
}
interface IAccount {
    address: string;
    authToken?: string;
}
interface IRequestAccountResp extends IRequestConnectResp {
    accounts: IAccount[];
    signature?: string;
}
interface IRequestSignMessageResp extends IRequestAccountResp {
    signature: string;
}
type Target = "_blank" | "_parent" | "_self" | "_top" | 'popup';
type IChainType = "NAKA" | "RUNE" | "EAI" | string;
interface IRequestPayload {
    target: Target;
    popupSize?: string;
    redirectURL?: string;
    signMessage?: string;
    callback?: () => string;
}
interface IRequestSignMessagePayload extends IRequestPayload {
    fromAddress: string;
    signMessage: string;
}
interface IRequestSignPayload extends IRequestPayload {
    calldata: string;
    functionName?: string;
    functionType?: string;
    gasPrice?: string;
    gasLimit?: string;
    from?: string;
    to?: string;
    value?: string;
    nonce?: number | string;
    isExecuteTransaction?: boolean;
    chainType: IChainType;
}
interface IRequestSignResp extends IRequestConnectResp {
    hash: string;
    nonce?: number;
    to?: string;
    from?: string;
}
export { RequestMethod, IRequestConnectResp, IRequestAccountResp, IRequestSignMessageResp, IRequestSignPayload, IRequestSignResp, IRequestPayload, IRequestSignMessagePayload, };
interface IResultConnectBase {
    method: RequestMethod;
    host: string;
    id: string;
}
type IResultConnectResp = IResultConnectBase & IRequestSignPayload & IRequestSignMessagePayload;
export { IResultConnectResp };
