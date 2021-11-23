import Vue from "vue";
import { readonly } from "vue-demi";
import { web3, web3UserContract } from "@/lib/web3";
import { Message, Notification } from "element-ui";
import { ITransactionReceipt } from "@/lib/types/web3";

interface IUserDetails {
  firstName: string;
  lastName: string;
  nationalId: string;
  gender: number;
  email: string;
  phone: string;
}

const INITIAL_STATE = readonly<{
  details: IUserDetails;
  detailsLoaded: boolean;
}>({
  details: {
    firstName: "",
    lastName: "",
    nationalId: "",
    gender: -1,
    email: "",
    phone: "",
  },
  detailsLoaded: false,
});

export const userModule = {
  namespaced: true,
  state: { ...INITIAL_STATE },
  mutations: {
    SET_USER_DETAILS(state: typeof INITIAL_STATE, payload: Partial<IUserDetails>) {
      if (payload.firstName) Vue.set(state.details, "firstName", payload.firstName);
      if (payload.lastName) Vue.set(state.details, "lastName", payload.lastName);
      if (payload.nationalId) Vue.set(state.details, "nationalId", payload.nationalId);
      if (payload.gender) Vue.set(state.details, "gender", payload.gender);
      if (payload.email) Vue.set(state.details, "email", payload.email);
      if (payload.phone) Vue.set(state.details, "phone", payload.phone);
      Vue.set(state, "detailsLoaded", true);
    },
    RESET_USER_STATE(state: typeof INITIAL_STATE) {
      Vue.set(state, "details", { ...INITIAL_STATE.details });
      Vue.set(state, "detailsLoaded", false);
    },
  },
  actions: {
    readUser({ commit, dispatch }: any, address: string): Promise<void> {
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
            console.log(receipt);
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
              if (error) console.error(error);
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
      commit("RESET_USER_STATE");
    },
  },
};
