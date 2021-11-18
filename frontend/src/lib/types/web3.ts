
export type AbiType = "function" | "constructor" | "event" | "fallback";
export type StateMutabilityType = "pure" | "view" | "nonpayable" | "payable";

export interface IAbiItem {
  anonymous?: boolean;
  constant?: boolean;
  inputs?: IAbiInput[];
  name?: string;
  outputs?: IAbiOutput[];
  payable?: boolean;
  stateMutability?: StateMutabilityType;
  type: AbiType;
  gas?: number;
}

export interface IAbiInput {
  name: string;
  type: string;
  indexed?: boolean;
  components?: IAbiInput[];
  internalType?: string;
}

export interface IAbiOutput {
  name: string;
  type: string;
  components?: IAbiOutput[];
  internalType?: string;
}

export type IContractAbi = IAbiItem[] | IAbiItem;

export interface ITransaction {
  hash: string;
  nonce: number;
  blockHash: string | null;
  blockNumber: number | null;
  transactionIndex: number | null;
  from: string;
  to: string | null;
  value: string;
  gasPrice: string;
  gas: number;
  input: string;
}

export interface ILog {
  address: string;
  blockHash: string;
  blockNumber: number;
  data: string;
  logIndex: number;
  topics: string[];
  transactionHash: string;
  transactionIndex: number;
}

export interface IEventLog {
  address: string;
  blockHash: string;
  blockNumber: number;
  event: string;
  id: string;
  logIndex: number;
  raw?: { data: string; topics: any[] };
  returnValues: any;
  signature: string;
  transactionHash: string;
  transactionIndex: number;
  type: string;
}

export interface ITransactionReceipt {
  blockHash: string;
  blockNumber: number;
  contractAddress: string | null;
  cumulativeGasUsed: number;
  events?: { [eventName: string]: IEventLog };
  from: string;
  gasUsed: number;
  logs?: ILog[];
  logsBloom: string;
  status: boolean;
  to: string;
  transactionHash: string;
  transactionIndex: number;
}
