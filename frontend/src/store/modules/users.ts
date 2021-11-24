import Vue from "vue";
import { web3, web3UserContract } from "@/lib/web3";
import { Message, Notification } from "element-ui";
import { ITransactionReceipt } from "@/lib/types/web3";

import { cloneDeep } from "lodash";

interface IUserDetails {
  firstName: string;
  lastName: string;
  nationalId: string;
  gender: number;
  email: string;
  phone: string;
}

interface IUserCreateFormData {
  firstName: string;
  lastName: string;
  nationalId: string;
  email: string;
  phone: string;
  gender: number;
  selectedAddress: string;
}

const INITIAL_STATE = {
  details: {
    firstName: "",
    lastName: "",
    nationalId: "",
    gender: -1,
    email: "",
    phone: "",
  },
  detailsLoaded: false,
};

console.log("initial state", INITIAL_STATE);

const STATE = cloneDeep(INITIAL_STATE);

export const userModule = {
  namespaced: true,

  state: STATE,

  mutations: {
    SET_USER_DETAILS(state: typeof STATE, payload: Partial<IUserDetails>) {
      if (typeof payload.firstName === "string") Vue.set(state.details, "firstName", payload.firstName);
      if (typeof payload.lastName === "string") Vue.set(state.details, "lastName", payload.lastName);
      if (typeof payload.nationalId === "string") Vue.set(state.details, "nationalId", payload.nationalId);
      if (typeof payload.gender === "string") Vue.set(state.details, "gender", Number(payload.gender));
      if (typeof payload.email === "string") Vue.set(state.details, "email", payload.email);
      if (typeof payload.phone === "string") Vue.set(state.details, "phone", payload.phone);

      Vue.set(state, "detailsLoaded", true);
    },

    RESET_USER_STATE(state: typeof STATE, payload: typeof INITIAL_STATE) {
      Vue.set(state, "details", payload.details);
      Vue.set(state, "detailsLoaded", payload.detailsLoaded);
    },
  },

  actions: {
    isUser({ dispatch }: any, address: string) {
      return new Promise<boolean>((resolve, reject) => {
        web3UserContract.methods
          .isUser(address)
          .call({ from: address })
          .then((res: boolean) => {
            resolve(res);
          })
          .catch((err: any) => {
            dispatch("resetUserState");

            Message({
              message: err.message,
              type: "error",
              duration: 0,
              showClose: true,
            });

            reject(err);
          });
      });
    },

    createUser({ dispatch }: any, payload: IUserCreateFormData): Promise<ITransactionReceipt> {
      return new Promise((resolve, reject) => {
        let receipt: ITransactionReceipt;
        let tx_hash = "";
        let infoNot: any = null;

        web3UserContract.methods
          .createUser(payload.firstName, payload.lastName, payload.nationalId, payload.email, payload.phone, payload.gender)
          .send({ from: payload.selectedAddress })
          .once("transactionHash", (txHash: string) => {
            tx_hash = txHash;

            infoNot = Notification.info({
              position: "bottom-left",
              duration: 0,
              dangerouslyUseHTMLString: true,
              message: `Create User:  <a href="https://rinkeby.etherscan.io/tx/${tx_hash}" target="_blank">${txHash.slice(0, 8) + "..." + txHash.slice(-8)}</a>`,
              title: "Transaction submitted!",
            });
          })
          .once("receipt", (res: any) => {
            receipt = res;
          })
          .then(() => {
            infoNot.close();

            Notification.success({
              position: "bottom-left",
              duration: 0,
              dangerouslyUseHTMLString: true,
              message: `Create User: <a href="https://rinkeby.etherscan.io/tx/${tx_hash}" target="_blank">${tx_hash.slice(0, 8) + "..." + tx_hash.slice(-8)}</a>`,
              title: "Transaction confirmed!",
            });

            dispatch("setUser", payload.selectedAddress);

            resolve(receipt);
          })
          .catch(async (error: any) => {
            await web3.eth.getTransactionReceipt(tx_hash, (error, transactionReceipt) => {
              if (error) console.error("Error during getting the receipt: ", error);
              receipt = transactionReceipt as ITransactionReceipt;
            });

            if (error.code === -32603) {
              Message({
                type: "error",
                message: "MetaMask RPC Error [-32603]: The tx doesn't have the correct nonce!",
                duration: 5000,
              });
            } else {
              Message({
                type: "error",
                message: error.message,
                duration: 5000,
              });
            }

            if (tx_hash.length) {
              infoNot.close();

              Notification.error({
                position: "bottom-left",
                duration: 0,
                dangerouslyUseHTMLString: true,
                message: `Create User: <a href="https://rinkeby.etherscan.io/tx/${tx_hash}" target="_blank">${tx_hash.slice(0, 8) + "..." + tx_hash.slice(-8)}</a>`,
                title: "Transaction reverted!",
              });
            }

            reject(error);
          });
      });
    },

    setUser({ commit, dispatch }: any, address: string): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        web3UserContract.methods
          .readUser()
          .call({ from: address })
          .then((res: any) => {
            commit("SET_USER_DETAILS", res);

            resolve(res);
          })
          .catch((err: any) => {
            Message.error({
              message: err.message,
              duration: 0,
            });

            dispatch("resetUserState");

            reject(err);
          });
      });
    },

    deleteUser({ dispatch }: any, address: string) {
      return new Promise<void>((resolve, reject) => {
        let receipt: ITransactionReceipt;
        let tx_hash = "";
        let infoNot: any;

        web3UserContract.methods
          .deleteUser()
          .send({ from: address })
          .once("transactionHash", (txHash: string) => {
            tx_hash = txHash;

            infoNot = Notification.info({
              position: "bottom-left",
              duration: 0,
              dangerouslyUseHTMLString: true,
              message: `Remove User:  <a href="https://rinkeby.etherscan.io/tx/${tx_hash}">${txHash.slice(0, 8) + "..." + txHash.slice(-8)}</a>`,
              title: "Transaction submitted!",
            });
          })
          .once("receipt", (res: any) => {
            receipt = res;
          })
          .then((res: any) => {
            infoNot.close();

            Notification.success({
              position: "bottom-left",
              duration: 0,
              dangerouslyUseHTMLString: true,
              message: `Remove User:  <a href="https://rinkeby.etherscan.io/tx/${tx_hash}">${tx_hash.slice(0, 8) + "..." + tx_hash.slice(-8)}</a>`,
              title: "Transaction confirmed!",
            });

            dispatch("resetUserState");
            resolve(res);
          })
          .catch(async (err: any) => {
            await web3.eth.getTransactionReceipt(tx_hash, (error, transactionReceipt) => {
              if (error) console.error("Error during getting the receipt: ", error);
              receipt = transactionReceipt as ITransactionReceipt;
            });

            if ([4001].includes(err.code)) {
              Message({
                message: err.message,
                type: "error",
                duration: 5000,
              });
            } else {
              if (tx_hash.length) {
                infoNot.close();

                Notification.error({
                  position: "bottom-left",
                  duration: 0,
                  dangerouslyUseHTMLString: true,
                  message: `Remove User: <a href="https://rinkeby.etherscan.io/tx/${tx_hash}">${tx_hash.slice(0, 8) + "..." + tx_hash.slice(-8)}</a>`,
                  title: "Transaction reverted!",
                });
              }
            }

            reject(err);
          });
      });
    },

    async resetUserState({ commit }: any): Promise<void> {
      commit("RESET_USER_STATE", INITIAL_STATE);
    },
  },
};
