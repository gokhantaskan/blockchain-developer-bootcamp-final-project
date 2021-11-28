import { web3, web3UserContract } from "@/lib/web3";
import { Message } from "element-ui";
import Vue from "vue";
import Vuex from "vuex";

import { userModule } from "./modules/user";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selectedAddress: "",
    isUser: false,
  },
  mutations: {
    SET_SELECTED_ADDRESS(state, payload) {
      Vue.set(state, "selectedAddress", payload);
    },
    SET_IS_USER(state, payload) {
      Vue.set(state, "isUser", payload);
    },
  },
  actions: {
    setSelectedAddress({ commit }: any, payload: string) {
      commit("SET_SELECTED_ADDRESS", web3.utils.toChecksumAddress(payload));
    },
    isUser({ commit, dispatch, rootState }: any) {
      return new Promise<boolean>((resolve, reject) => {
        web3UserContract.methods
          .isUser(rootState.selectedAddress)
          .call({ from: rootState.selectedAddress })
          .then((res: boolean) => {
            commit("SET_IS_USER", res);

            resolve(res);
          })
          .catch((err: any) => {
            dispatch("user/resetUserState");

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
  },
  modules: {
    user: userModule as any,
  },
});

// const unsubscribeAction = store.subscribeAction({
//   before: (action, state: any) => {
//     console.log(`before ${action.type}: `, state.user.details.firstName);
//   },
//   after: (action, state: any) => {
//     console.log(`after ${action.type}: `, state.user.details.firstName);
//   },
// });

export default store;
