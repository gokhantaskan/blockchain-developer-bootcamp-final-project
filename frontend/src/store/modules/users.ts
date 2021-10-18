import Vue from "vue";
import { readonly } from "@vue/composition-api";
import { userContract } from "../../contracts";
import { Message, Notification } from "element-ui";

interface IUserDetails {
  firstName: string;
  lastName: string;
  nationalId: string;
  email: string;
  phone: string;
}

const INITIAL_STATE = readonly({
  details: {
    firstName: "",
    lastName: "",
    nationalId: "",
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
        userContract.methods
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
              duration: 5000,
            });

            dispatch("resetUserState");
          });
      });
    },
    removeUser({ dispatch }: any, address: string) {
      return new Promise<void>((resolve, reject) => {
        let tx_hash = "";

        userContract.methods
          .removeUser()
          .send({ from: address }, (_: unknown, txHash: string) => console.log(_, txHash))
          .once("transactionHash", (txHash: string) => {
            tx_hash = txHash;

            Notification.info({
              position: "bottom-left",
              duration: 5000,
              message: `Tx Hash: ${txHash.slice(0, 10) + "..." + txHash.slice(-10)}`,
              title: "Transaction submitted!",
            });
          })
          .then((res: any) => {
            Notification.success({
              position: "bottom-left",
              duration: 0,
              message: `Tx Hash: ${res.transactionHash.slice(0, 10) + "..." + res.transactionHash.slice(-10)}`,
              title: "Transaction accepted!",
            });

            dispatch("resetUserState");
            resolve(res);
          })
          .catch((err: any) => {
            Message({
              message: err.message.split(":"),
              type: "error",
              duration: 5000,
            });

            Notification.error({
              position: "bottom-left",
              duration: 0,
              message: `Tx Hash: ${tx_hash.slice(0, 10) + "..." + tx_hash.slice(-10)}`,
              title: "Transaction reverted!",
            });

            reject(err);
          });
      });
    },
    async resetUserState({ commit }: any): Promise<void> {
      commit("RESET_USER_STATE");
    },
  },
};
