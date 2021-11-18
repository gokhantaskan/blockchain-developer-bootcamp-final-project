import Web3 from "web3";
// import { ethers } from "ethers";
import { _window } from "./globals";

import { IContractAbi } from "@/lib/types/web3.js";
import UserDist from "../../../blockchain/build/contracts/Users.json";

export const web3 = new Web3(_window.ethereum || "http://localhost:7545");
export const web3UserContract = new web3.eth.Contract(UserDist.abi as IContractAbi, process.env.VUE_APP_USERS_CONTRACT_ADDRESS);
// web3UserContract.handleRevert = true;

/**
 * ! Ethers START
 */
// const ethersProvider = new ethers.providers.Web3Provider(_window.ethereum);
// const signer = ethersProvider.getSigner();
// export const ethersUserContract = new ethers.Contract(process.env.VUE_APP_USERS_CONTRACT_ADDRESS as string, UserDist.abi, signer);

// console.log(await ethersUserContract);
/**
 * ! Ethers END
 */
