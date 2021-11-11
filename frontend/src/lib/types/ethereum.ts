export interface IRequestArguments {
  method: string;
  params?: unknown[] | Record<string, any>;
}

export interface IProviderMessage {
  type: string;
  data: unknown;
}

export interface IEthereum {
  accounts: string[] | [];
  selectedAddress: string | null;
  networkVersion: string | null;
  chainId: string | null;
  chainName: string;
  isMetaMask: boolean;
  isConnected: boolean;
  request: (args: IRequestArguments) => Promise<unknown>;
  initialize: () => Promise<void>;
  requestAccounts: () => Promise<void>;
  setChainName: () => void;
  setListeners?: () => void;
  removeListeners?: () => void;
}
