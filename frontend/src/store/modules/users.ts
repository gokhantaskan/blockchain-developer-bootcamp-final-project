import Vue from "vue";
import { readonly } from "@vue/composition-api";
import { userContract } from "../../contracts";
import { Message } from "element-ui";

interface IUser {
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
    SET_USER_DETAILS(state: typeof INITIAL_STATE, payload: IUser) {
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
    async getUserDetails({ commit, dispatch }: any, address: string): Promise<void> {
      await userContract.methods.getUserDetails().call({ from: address })
        .then((res: any) => {
          commit("SET_USER_DETAILS", res);
        })
        .catch((err: any) => {
          Message({
            message: err.message,
            type: "error",
            duration: 5000,
          });

          dispatch("resetUserState");
        });
    },
    async removeUser({ dispatch }: any, address: string): Promise<void> {
      await userContract.methods.removeUser().send({ from: address })
        .then(() => {
          dispatch("resetUserState");
        })
        .catch((err: any) => {
          Message({
            message: err.message,
            type: "error",
            duration: 5000,
          });
        });
    },
    async resetUserState({ commit }: any): Promise<void> {
      commit("RESET_USER_STATE");
    },
  },
};
