import Web3 from "web3";
import storageJson from "../../../blockchain/build/contracts/Storage.json";
// import Onboard from "bnc-onboard";
// import { useEthereum } from "@/composables/ethereum";

// let web3;

// const onboard = Onboard({
//   dappId: process.env.VUE_APP_ONBOARD_API_KEY,
//   networkId: Number(useEthereum().state.networkVersion),
//   subscriptions: {
//     wallet: wallet => { web3 = new Web3(wallet.provider) },
//   },
//   walletSelect: {
//     wallets: [
//       { walletName: "metamask" },
//     ],
//   },
// });

// export async function onboardUser() {
//   await onboard.walletSelect();
//   await onboard.walletCheck();
// }

const storageContractAddress = "0x9909829a2a18132a775B31746738A76E903d84d0";

export const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
export const storageContract = new web3.eth.Contract(storageJson.abi as any, storageContractAddress);

console.log(storageContract);
// if (useEthereum().state.selectedAddress) storageContract.methods.store(15).send({ from: useEthereum().state.selectedAddress }).then(console.log);
