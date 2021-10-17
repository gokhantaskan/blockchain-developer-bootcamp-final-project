import Vue from "vue";
import Vuex from "vuex";
import { attendeeModule } from "./modules/attendees";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    attendee: attendeeModule as any,
  },
});
