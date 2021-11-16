import Web3 from "web3";
import { IContractAbi } from "@/lib/types/web3.js";
import UserDist from "../../../blockchain/build/contracts/Users.json";

export const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

export const userContract = new web3.eth.Contract(UserDist.abi as IContractAbi, process.env.VUE_APP_USERS_CONTRACT_ADDRESS);
// userContract.handleRevert = true;
