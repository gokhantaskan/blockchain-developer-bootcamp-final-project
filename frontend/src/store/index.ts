import { web3 } from "@/lib/web3";
import Vue from "vue";
import Vuex from "vuex";

import { userModule } from "./modules/user";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selectedAddress: "",
  },
  mutations: {
    SET_SELECTED_ADDRESS(state, payload) {
      Vue.set(state, "selectedAddress", payload);
    },
  },
  actions: {
    setSelectedAddress({ commit }: any, payload: string) {
      commit("SET_SELECTED_ADDRESS", web3.utils.toChecksumAddress(payload));
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
