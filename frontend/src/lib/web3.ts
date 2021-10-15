import Web3 from "web3";
import { useEthereum } from "@/composables/ethereum";
import storageJson from "../../../blockchain/build/contracts/Storage.json";

export const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

const defaultAccount = useEthereum().state.selectedAddress;
web3.eth.defaultAccount = defaultAccount;

const storageContractAddress = "0x831Bf273BEE9c812cD7d8C10A93f048F951a301F";
const storageContract = new web3.eth.Contract(storageJson.abi as any, storageContractAddress);

console.log(web3.eth);

console.log(storageContract);
if (defaultAccount) storageContract.methods.store(15).send({ from: defaultAccount }).then(console.log);

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
