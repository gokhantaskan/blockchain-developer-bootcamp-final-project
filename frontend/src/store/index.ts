import Vue from "vue";
import Vuex from "vuex";
import { userModule } from "./modules/users";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user: userModule as any,
  },
});

// const unsubscribeAction = store.subscribeAction({
//   before: (action, state: any) => {
//     console.log("before action type: ", action.type, action.payload, state.user.details);
//   },
//   after: (action, state: any) => {
//     console.log("after action type: ", action.type, action.payload, state.user.details);
//   },
// });

export default store;
