import { IContractAbi } from "@/lib/types/web3.js";
import { web3 } from "@/lib/web3";
import abi from "../abi/attendee.js";

export const attendeeContract = new web3.eth.Contract(abi as IContractAbi, "0xdb540e6De050CB194d0490c5356D6709471d9E30");
