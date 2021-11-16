import Vue from "vue";
import { readonly } from "vue-demi";
import { web3UserContract } from "@/lib/web3";
import { Message, Notification } from "element-ui";

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
    SET_USER_DETAILS(state: typeof INITIAL_STATE, payload: IUserDetails) {
      Vue.set(state, "details", {
        firstName: payload.firstName,
        lastName: payload.lastName,
        nationalId: payload.nationalId,
        gender: payload.gender,
        email: payload.email,
        phone: payload.phone,
      });
      Vue.set(state, "detailsLoaded", true);
    },
    RESET_USER_STATE(state: typeof INITIAL_STATE) {
      Vue.set(state, "details", INITIAL_STATE.details);
      Vue.set(state, "detailsLoaded", false);
    },
  },
  actions: {
    getUserDetails({ commit, dispatch }: any, address: string): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        web3UserContract.methods
          .getUserDetails()
          .call({ from: address })
          .then((res: any) => {
            commit("SET_USER_DETAILS", res);

            resolve(res);
          })
          .catch((err: any) => {
            reject(err);

            Message.error({
              message: err.message,
              duration: 0,
            });

            dispatch("resetUserState");
          });
      });
    },
    removeUser({ dispatch }: any, address: string) {
      return new Promise<void>((resolve, reject) => {
        let tx_hash = "";

        web3UserContract.methods
          .removeUser()
          .send({ from: address })
          .once("transactionHash", (txHash: string) => {
            tx_hash = txHash;

            Notification.info({
              position: "bottom-left",
              duration: 0,
              message: `Remove User: ${txHash.slice(0, 10) + "..." + txHash.slice(-10)}`,
              title: "Transaction submitted!",
            });
          })
          .then((res: any) => {
            Notification.success({
              position: "bottom-left",
              duration: 0,
              message: `Remove User: ${res.transactionHash.slice(0, 10) + "..." + res.transactionHash.slice(-10)}`,
              title: "Transaction confirmed!",
            });

            dispatch("resetUserState");
            resolve(res);
          })
          .catch((err: any) => {
            if ([4001].includes(err.code)) {
              Message({
                message: err.message,
                type: "error",
                duration: 5000,
              });
            } else {
              if (tx_hash.length) {
                Notification.error({
                  position: "bottom-left",
                  duration: 0,
                  message: `Remove User: ${tx_hash.slice(0, 10) + "..." + tx_hash.slice(-10)}`,
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
