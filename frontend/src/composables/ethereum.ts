import { _window } from "@/lib/globals";
import { onMounted, onUnmounted, readonly, ref, watch } from "vue";

const ethereum = _window.ethereum ? readonly(_window.ethereum) : undefined;
const accounts = ref<string[]>([]);

const isMetaMask = () => Boolean(ethereum && ethereum.isMetaMask);
const isConnected = () => Boolean(ethereum && ethereum.isConnected);
const selectedAddress = () => ethereum.selectedAddress || "";

const requestAccounts = async () => {
  try {
    accounts.value = await ethereum.request({ method: "eth_requestAccounts" });
  } catch (error: any) {
    if (error.code === 4001) {
      // EIP-1193 userRejectedRequest error
      // If this happens, the user rejected the connection request.
      alert(error.message);
    } else {
      console.error(error);
    }
  }
};

watch(
  accounts,
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
      _window.ethereum.on("accountsChanged", (accs: string[]): void => { accounts.value = accs });
      _window.ethereum.on("chainChanged", (_chainId: string): void => { location.reload() });
    }
  });

  onUnmounted(() => {
    if (_window.ethereum !== undefined) {
      _window.ethereum.removeListener("connect", (_connectInfo: { chainId: string }): void => { console.log("Connection attempt!") });
      _window.ethereum.removeListener("disconnect", (_error: any): void => { console.log("Disconnection attempt!") });
      _window.ethereum.removeListener("accountsChanged", (accs: string[]) => (accounts.value = accs));
      _window.ethereum.removeListener("chainChanged", (_chainId: string | number) => (location.reload()));
    }
  });

  return {
    ethereum,
    isMetaMask,
    isConnected,
    accounts,
    requestAccounts,
    selectedAddress,
  };
}
