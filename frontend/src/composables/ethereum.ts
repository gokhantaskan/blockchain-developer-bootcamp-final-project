import { _window } from "@/lib/globals";
import { onMounted, onUnmounted, reactive, readonly, watch } from "vue";
interface IEthereum {
  accounts: string[];
  selectedAddress: string;
  networkVersion: string;
  chainId: string;
  isMetaMask: boolean;
  isConnected: boolean;
  initialize: () => Promise<void>;
  requestAccounts: () => void;
}

const state = reactive<IEthereum>({
  accounts: [],
  isMetaMask: false,
  isConnected: false,
  selectedAddress: "",
  networkVersion: "",
  chainId: "",
  initialize: async (): Promise<void> => {
    try {
      const eth = await _window.ethereum;

      state.isMetaMask = Boolean(eth && eth.isMetaMask);
      state.isConnected = Boolean(eth && eth.isConnected);
      state.selectedAddress = (eth !== undefined) ? eth.selectedAddress : "";
      state.chainId = (eth !== undefined) ? eth.chainId : "";
      state.networkVersion = (eth !== undefined) ? eth.networkVersion : "";

      return;
      /*  */
    } catch (error: any) {
      console.error(error);
    }
  },
  requestAccounts: async () => {
    try {
      state.accounts = await _window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error: any) {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        alert(error.message);
      } else {
        console.error(error);
      }
    }
  },
});

watch(
  state.accounts,
  (newAccounts, oldAccounts) => {
    if (JSON.stringify(newAccounts) !== JSON.stringify(oldAccounts)) {
      console.log(`Selected Account: ${newAccounts[0]}`);
      if (oldAccounts[0]) console.log(`Switched Account: ${oldAccounts[0]}`);
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
