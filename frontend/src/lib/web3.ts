import Web3 from "web3";
import { useEthereum } from "@/composables/ethereum";
import storageJson from "../../../blockchain/build/contracts/Storage.json";
import attendeesJson from "../../../blockchain/build/contracts/Attendees.json";

export const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

const storageContractAddress = "0xF82BE704B1C336faEd7430036faB07A97ade0890";
const attendeesContractAddress = "0x10a1ce0b8FD5EB1EbF785e6B268fAa933ea274A3";
const storageContract = new web3.eth.Contract(storageJson.abi as any, storageContractAddress);
const attendeesContract = new web3.eth.Contract(attendeesJson.abi as any, attendeesContractAddress);

console.log(web3.eth);

console.log(storageContract);
console.log(attendeesContract);

if (useEthereum().state.selectedAddress) {
  storageContract.methods.store(15).send({
    from: useEthereum().state.selectedAddress
  })
    .then(console.log);
}

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
