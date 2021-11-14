export interface IRequestArguments {
  method: string;
  params?: unknown[] | Record<string, any>;
}

export interface IProviderMessage {
  type: string;
  data: unknown;
}

export interface IEthereum {
  chains: Record<string, string>[];
  accounts: string[] | [];
  selectedAddress: string | null;
  networkVersion: string | null;
  chainId: string | null;
  chainName: string | undefined;
  isMetaMask: boolean;
  isConnected: boolean;
  allowedChains: string[];
  request: (args: IRequestArguments) => Promise<unknown>;
  initialize: () => Promise<void>;
  requestAccounts: () => Promise<void>;
  setAllowedChains: (arg: string[]) => void;
  setListeners?: () => void;
  removeListeners?: () => void;
}
