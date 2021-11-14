import { _window } from "@/lib/globals";
import { IEthereum, IProviderMessage, IRequestArguments } from "@/lib/types/ethereum";
import { reactive, readonly, watch } from "vue-demi";

const state = reactive<IEthereum>({
  chains: [
    { id: "0x1", name: "Ethereum Main Network (Mainnet)" },
    { id: "0x3", name: "Ropsten Test Network" },
    { id: "0x4", name: "Rinkeby Test Network" },
    { id: "0x5", name: "Goerli Test Network" },
    { id: "0x2a", name: "Kovan Test Network" },
  ],
  accounts: [],
  isMetaMask: false,
  isConnected: false,
  selectedAddress: "",
  networkVersion: "",
  chainId: "",
  chainName: "",
  allowedChains: [],
  request: (args: IRequestArguments) => _window.ethereum.request(args),
  initialize: async (): Promise<void> => {
    try {
      const ethereum = await _window.ethereum;

      state.isMetaMask = Boolean(ethereum && ethereum.isMetaMask);
      state.isConnected = Boolean(ethereum && ethereum.isConnected);
      state.selectedAddress = (ethereum !== undefined) ? ethereum.selectedAddress : "";
      state.networkVersion = (ethereum !== undefined) ? ethereum.networkVersion : "";
      state.chainId = (ethereum !== undefined) ? ethereum.chainId : "";
      state.chainName = state.chains.find(chain => chain.id === state.chainId)?.name || "Unknown Chain";
      /*  */
    } catch (error: any) {
      alert(`Initialize error: ${error.message}`);
      throw new Error(error);
    }
  },
  requestAccounts: async () => {
    try {
      state.accounts = await _window.ethereum.request({ method: "eth_requestAccounts" });
      state.initialize();
      /*  */
    } catch (error: any) {
      if ([4001, -32002].includes(error.code)) {
        // ! EIP-1193 userRejectedRequest error - If this happens, the user rejected the connection request.
        // ! Error -32002 - If this happens, the user requested the connection and MetaMask is waiting for confirmation.
        throw new Error(error.message);
      } else {
        throw new Error(error);
      }
    }
  },
  setAllowedChains: (chainIds: string[]): void => {
    state.allowedChains = chainIds;
  },
  setListeners: (): void => {
    if (_window.ethereum !== undefined) {
      _window.ethereum.on("connect", (_connectInfo: { chainId: string }): void => { console.log("Connection attempt!") });
      _window.ethereum.on("disconnect", (_error: any): void => { console.log("Disconnection attempt!") });
      _window.ethereum.on("accountsChanged", (accs: string[]): void => { state.accounts = accs });
      _window.ethereum.on("chainChanged", (_chainId: string): void => { location.reload() });
      // _window.ethereum.on("message", (message: IProviderMessage): void => { console.log(message.data, message.type) });
    }
  },
  removeListeners: () => {
    if (_window.ethereum !== undefined) {
      // _window.ethereum.removeListener("connect", (_connectInfo: { chainId: string }): void => { console.log("Connection attempt!") });
      _window.ethereum.removeListener("disconnect", (_error: any): void => { console.log("Disconnection attempt!") });
      _window.ethereum.removeListener("accountsChanged", (accs: string[]) => (state.accounts = accs));
      _window.ethereum.removeListener("chainChanged", (_chainId: string | number) => (location.reload()));
      // _window.ethereum.removeListener("message", (message: IProviderMessage): void => { console.log(message.data, message.type) });
    }
  },
});

watch(
  () => [state.accounts],
  ([newAccounts], [oldAccounts]) => {
    if (JSON.stringify(newAccounts) !== JSON.stringify(oldAccounts)) {
      state.initialize();

      /* eslint-disable */
      console.log(`Selected Account: ${newAccounts[0].slice(0, 8)}...`);
      if (oldAccounts[0]) console.log(`Switched Account: ${oldAccounts[0].slice(0, 8)}...`);
      /* eslint-enable */
    }
  }
);

export function useEthereum() {
  return {
    state: readonly(state),
  };
}
