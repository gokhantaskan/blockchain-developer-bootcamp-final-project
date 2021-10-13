import Web3 from "web3";
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

export const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
