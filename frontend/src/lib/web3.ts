import Web3 from "web3";
// import { useEthereum } from "@/composables/ethereum";
// import storageJson from "../../../blockchain/build/contracts/Storage.json";
// import attendeesJson from "../../../blockchain/build/contracts/Attendees.json";
// import { IContractAbi } from "./types/web3";

export const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

// const storageContract = new web3.eth.Contract(storageJson.abi as IContractAbi, "0xeD6a7A806E26b0aA9289D352fEFAEB80081F78b2");
// const attendeesContract = new web3.eth.Contract(attendeesJson.abi as IContractAbi, "0xa08467363a560A6b1227669fa2352C9B0767BF72");

// if (useEthereum().state.selectedAddress) {
//   storageContract.methods.store(15).send({
//     from: useEthereum().state.selectedAddress,
//   })
//     .then(console.log);
// }

/**
 *
**/

// import Onboard from "bnc-onboard";

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
