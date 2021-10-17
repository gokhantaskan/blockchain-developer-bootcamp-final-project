import Vue from "vue";
import { readonly } from "@vue/composition-api";
import { attendeeContract } from "../../contracts";
import { Message } from "element-ui";

interface IAttendee {
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

export const attendeeModule = {
  namespaced: true,
  state: { ...INITIAL_STATE },
  mutations: {
    SET_ATTENDEE_DETAILS(state: typeof INITIAL_STATE, payload: IAttendee) {
      Vue.set(state, "details", {
        firstName: payload.firstName,
        lastName: payload.lastName,
        nationalId: payload.nationalId,
        email: payload.email,
        phone: payload.phone,
      });
      Vue.set(state, "detailsLoaded", true);
    },
    RESET_ATTENDEE_STATE(state: typeof INITIAL_STATE) {
      Vue.set(state, "details", INITIAL_STATE.details);
      Vue.set(state, "detailsLoaded", false);
    },
  },
  actions: {
    async getAttendeeDetails({ commit, dispatch }: any, address: string): Promise<void> {
      await attendeeContract.methods.getAttendeeDetails().call({ from: address })
        .then((res: any) => {
          commit("SET_ATTENDEE_DETAILS", res);
        })
        .catch((err: any) => {
          Message({
            message: err.message,
            type: "error",
            duration: 5000,
          });

          dispatch("resetAttendeeState");
        });
    },
    async resetAttendeeState({ commit }: any): Promise<void> {
      commit("RESET_ATTENDEE_STATE");
    },
  },
};
