import { _window } from "@/lib/globals";
import { IEthereum, IProviderMessage } from "@/lib/types/ethereum";
import { onMounted, onUnmounted, reactive, readonly, watch } from "vue";

const state = reactive<IEthereum>({
  accounts: [],
  isMetaMask: false,
  isConnected: false,
  selectedAddress: "",
  networkVersion: "",
  chainId: "",
  chainName: "",
  initialize: async (): Promise<void> => {
    try {
      const eth = await _window.ethereum;

      state.isMetaMask = Boolean(eth && eth.isMetaMask);
      state.isConnected = Boolean(eth && eth.isConnected);
      state.selectedAddress = (eth !== undefined) ? eth.selectedAddress : "";
      state.networkVersion = (eth !== undefined) ? eth.networkVersion : "";
      state.chainId = (eth !== undefined) ? eth.chainId : "";
      state.setChainName();
      /*  */
    } catch (error: any) {
      console.error(error);
    }
  },
  requestAccounts: async () => {
    try {
      state.accounts = await _window.ethereum.request({ method: "eth_requestAccounts" });
      state.initialize();
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
});

watch(
  () => [state.accounts],
  ([newAccounts], [oldAccounts]) => {
    if (JSON.stringify(newAccounts) !== JSON.stringify(oldAccounts)) {
      state.initialize();

      console.log(`Selected Account: ${newAccounts[0].slice(0, 4)}...`);
      if (oldAccounts[0]) console.log(`Switched Account: ${oldAccounts[0].slice(0, 4)}...`);
    }
  }
);

export function useEthereum() {
  onMounted(() => {
    if (_window.ethereum !== undefined) {
      _window.ethereum.on("connect", (_connectInfo: { chainId: string }): void => { console.log("Connection attempt!") });
      _window.ethereum.on("disconnect", (_error: any): void => { console.log("Disconnection attempt!") });
      _window.ethereum.on("accountsChanged", (accs: string[]): void => { state.accounts = accs });
      _window.ethereum.on("chainChanged", (_chainId: string): void => { location.reload() });
      _window.ethereum.on("message", (message: IProviderMessage): void => { console.log(message.data, message.type) });
    }
  });

  onUnmounted(() => {
    if (_window.ethereum !== undefined) {
      _window.ethereum.removeListener("connect", (_connectInfo: { chainId: string }): void => { console.log("Connection attempt!") });
      _window.ethereum.removeListener("disconnect", (_error: any): void => { console.log("Disconnection attempt!") });
      _window.ethereum.removeListener("accountsChanged", (accs: string[]) => (state.accounts = accs));
      _window.ethereum.removeListener("chainChanged", (_chainId: string | number) => (location.reload()));
    }
  });

  return {
    state: readonly(state),
  };
}
