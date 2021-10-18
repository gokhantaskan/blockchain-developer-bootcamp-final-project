import { IContractAbi } from "@/lib/types/web3.js";
import { web3 } from "@/lib/web3";
import abi from "../abi/user.js";

export const userContract = new web3.eth.Contract(abi as IContractAbi, process.env.VUE_APP_USERS_CONTRACT_ADDRESS);
