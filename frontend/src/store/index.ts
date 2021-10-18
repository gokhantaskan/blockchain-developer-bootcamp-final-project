import Vue from "vue";
import Vuex from "vuex";
import { userModule } from "./modules/users";

Vue.use(Vuex);

export default new Vuex.Store({
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
