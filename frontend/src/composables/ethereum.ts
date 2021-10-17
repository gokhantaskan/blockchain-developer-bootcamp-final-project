import { _window } from "@/lib/globals";
import { IEthereum, IProviderMessage, IRequestArguments } from "@/lib/types/ethereum";
import { reactive, readonly, watch } from "@vue/composition-api";

const state = reactive<IEthereum>({
  accounts: [],
  isMetaMask: false,
  isConnected: false,
  selectedAddress: "",
  networkVersion: "",
  chainId: "",
  chainName: "",
  request: (args: IRequestArguments) => _window.ethereum.request(args),
  initialize: async (): Promise<void> => {
    try {
      const ethereum = await _window.ethereum;

      state.isMetaMask = Boolean(ethereum && ethereum.isMetaMask);
      state.isConnected = Boolean(ethereum && ethereum.isConnected);
      state.selectedAddress = (ethereum !== undefined) ? ethereum.selectedAddress : "";
      state.networkVersion = (ethereum !== undefined) ? ethereum.networkVersion : "";
      state.chainId = (ethereum !== undefined) ? ethereum.chainId : "";
      state.setChainName();
      /*  */
    } catch (error: any) {
      alert(error.message);
    }
  },
  requestAccounts: async () => {
    try {
      state.accounts = await _window.ethereum.request({ method: "eth_requestAccounts" });
      state.initialize();
      /*  */
    } catch (error: any) {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        alert(error.message);
      } else if (error.code === -32002) {
        // If this happens, the user requested the connection and MetaMask is waiting for confirmation.
        alert(error.message);
      } else {
        console.error(error);
      }
    }
  },
  setChainName: (): void => {
    if (state.chainId === "0x1") state.chainName = "Ethereum Main Network (Mainnet)";
    else if (state.chainId === "0x3") state.chainName = "Ropsten Test Network";
    else if (state.chainId === "0x4") state.chainName = "Rinkeby Test Network";
    else if (state.chainId === "0x5") state.chainName = "Goerli Test Network";
    else if (state.chainId === "0x2a") state.chainName = "Kovan Test Network";
    else state.chainName = "Unknown Chain/Network";
  },
  setListeners: (): void => {
    if (_window.ethereum !== undefined) {
      _window.ethereum.on("connect", (_connectInfo: { chainId: string }): void => {
        console.log("Connection attempt!");
        state.requestAccounts();
      });
      _window.ethereum.on("disconnect", (_error: any): void => { console.log("Disconnection attempt!") });
      _window.ethereum.on("accountsChanged", (accs: string[]): void => { state.accounts = accs });
      _window.ethereum.on("chainChanged", (_chainId: string): void => { location.reload() });
      _window.ethereum.on("message", (message: IProviderMessage): void => { console.log(message.data, message.type) });
    }
  },
  removeListeners: () => {
    if (_window.ethereum !== undefined) {
      _window.ethereum.removeListener("connect", (_connectInfo: { chainId: string }): void => { console.log("Connection attempt!") });
      _window.ethereum.removeListener("disconnect", (_error: any): void => { console.log("Disconnection attempt!") });
      _window.ethereum.removeListener("accountsChanged", (accs: string[]) => (state.accounts = accs));
      _window.ethereum.removeListener("chainChanged", (_chainId: string | number) => (location.reload()));
    }
  },
});

watch(
  () => [state.accounts],
  ([newAccounts], [oldAccounts]) => {
    if (JSON.stringify(newAccounts) !== JSON.stringify(oldAccounts)) {
      state.initialize();

      console.log(`Selected Account: ${newAccounts[0].slice(0, 8)}...`);
      if (oldAccounts[0]) console.log(`Switched Account: ${oldAccounts[0].slice(0, 8)}...`);
    }
  }
);

export function useEthereum() {
  return {
    state: readonly(state),
  };
}
