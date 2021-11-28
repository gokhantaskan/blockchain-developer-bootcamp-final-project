import Vue from "vue";
import { web3, web3OrganizationContract } from "@/lib/web3";
import { Message, Notification } from "element-ui";
import { ITransactionReceipt } from "@/lib/types/web3";

import { cloneDeep } from "lodash";
import { IOrganizationDetailsRes, IOrganizationFormData } from "@/lib/types";

const INITIAL_STATE = {
  contractAddress: "",
  details: {
    name: "",
    registrationId: "",
    email: "",
    phone: "",
    admins: [] as string[],
    owner: "",
  },
  detailsLoaded: false,
};

const STATE = cloneDeep(INITIAL_STATE);

export const organizationModule = {
  namespaced: true,

  state: STATE,

  mutations: {
    SET_CONTRACT_ADDRESS(state: typeof STATE, payload: string) {
      Vue.set(state, "contractAddress", payload);
    },

    SET_ORGANIZATION_DETAILS(state: typeof STATE, payload: Partial<IOrganizationDetailsRes>) {
      if (typeof payload._name === "string") Vue.set(state.details, "name", payload._name);
      if (typeof payload._registrationId === "string") Vue.set(state.details, "registrationId", payload._registrationId);
      if (typeof payload._email === "string") Vue.set(state.details, "email", payload._email);
      if (typeof payload._phone === "string") Vue.set(state.details, "phone", payload._phone);
      if (typeof payload._admins === "object") Vue.set(state.details, "admins", payload._admins);
      if (typeof payload._owner === "string") Vue.set(state.details, "owner", payload._owner);

      Vue.set(state, "detailsLoaded", true);
    },

    RESET_ORGANIZATION_STATE(state: typeof STATE, payload: typeof INITIAL_STATE) {
      Vue.set(state, "details", payload.details);
      Vue.set(state, "detailsLoaded", payload.detailsLoaded);
    },
  },

  actions: {
    setContractAddress({ commit }: any, payload: string) {
      commit("SET_CONTRACT_ADDRESS", payload);
    },

    setOrganization({ commit, dispatch, state }: any): Promise<IOrganizationDetailsRes> {
      return new Promise((resolve, reject) => {
        web3OrganizationContract(state.contractAddress).methods
          .readOrganization()
          .call({ from: state.selectedAddress })
          .then((res: any) => {
            commit("SET_ORGANIZATION_DETAILS", res);

            resolve(res);
          })
          .catch((err: any) => {
            Message.error({
              message: err.message,
              duration: 0,
              showClose: true,
            });

            dispatch("resetOrganizationState");

            reject(err);
          });
      });
    },

    updateOrganization({ dispatch, state, rootState }: any, payload: Partial<IOrganizationFormData>): Promise<{ res: ITransactionReceipt }> {
      return new Promise((resolve, reject) => {
        let receipt: ITransactionReceipt;
        let tx_hash = "";
        let infoNot: any;

        web3OrganizationContract(state.contractAddress).methods
          .updateOrganizationDetails(payload.name, payload.registrationId, payload.email, payload.phone)
          .send({ from: rootState.selectedAddress })
          .once("transactionHash", (txHash: string) => {
            tx_hash = txHash;

            infoNot = Notification.info({
              position: "bottom-left",
              duration: 0,
              dangerouslyUseHTMLString: true,
              message: `Update Organization:  <a href="https://ropsten.etherscan.io/tx/${tx_hash}" target="_blank">${txHash.slice(0, 8) + "..." + txHash.slice(-8)}</a>`,
              title: "Transaction submitted!",
            });
          })
          .once("receipt", (res: any) => {
            receipt = res;
          })
          .then((res: any) => {
            infoNot.close();

            Notification.success({
              position: "bottom-left",
              duration: 0,
              dangerouslyUseHTMLString: true,
              message: `Update Organization:  <a href="https://ropsten.etherscan.io/tx/${tx_hash}" target="_blank">${tx_hash.slice(0, 8) + "..." + tx_hash.slice(-8)}</a>`,
              title: "Transaction confirmed!",
            });

            dispatch("setOrganization");

            resolve({ res });
          })
          .catch(async (err: any) => {
            await web3.eth.getTransactionReceipt(tx_hash, (error, transactionReceipt) => {
              if (error) console.error("Error during getting the receipt: ", error);
              receipt = transactionReceipt as ITransactionReceipt;
            });

            Message({
              type: "error",
              message: err.message,
              duration: 5000,
            });

            if (tx_hash.length) {
              infoNot.close();

              Notification.error({
                position: "bottom-left",
                duration: 0,
                dangerouslyUseHTMLString: true,
                message: `Update user:  <a href="https://ropsten.etherscan.io/tx/${tx_hash}" target="_blank">${tx_hash.slice(0, 8) + "..." + tx_hash.slice(-8)}</a>`,
                title: "Transaction reverted!",
              });
            }

            reject(err);
          });
      });
    },

    deleteOrganization({ dispatch, state }: any): Promise<{ res: ITransactionReceipt }> {
      return new Promise((resolve, reject) => {
        let receipt: ITransactionReceipt;
        let tx_hash = "";
        let infoNot: any;

        web3OrganizationContract(state.contractAddress).methods
          .deleteOrganization()
          .send({ from: state.selectedAddress })
          .once("transactionHash", (txHash: string) => {
            tx_hash = txHash;

            infoNot = Notification.info({
              position: "bottom-left",
              duration: 0,
              dangerouslyUseHTMLString: true,
              message: `Remove Organization:  <a href="https://ropsten.etherscan.io/tx/${tx_hash}">${txHash.slice(0, 8) + "..." + txHash.slice(-8)}</a>`,
              title: "Transaction submitted!",
            });
          })
          .once("receipt", (res: any) => {
            receipt = res;
          })
          .then((res: any) => {
            infoNot.close();

            Notification.success({
              position: "bottom-left",
              duration: 0,
              dangerouslyUseHTMLString: true,
              message: `Remove User:  <a href="https://ropsten.etherscan.io/tx/${tx_hash}">${tx_hash.slice(0, 8) + "..." + tx_hash.slice(-8)}</a>`,
              title: "Transaction confirmed!",
            });

            dispatch("resetOrganizationState");
            resolve({ res });
          })
          .catch(async (err: any) => {
            await web3.eth.getTransactionReceipt(tx_hash, (error, transactionReceipt) => {
              if (error) console.error("Error during getting the receipt: ", error);
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
                  message: `Remove User: <a href="https://ropsten.etherscan.io/tx/${tx_hash}">${tx_hash.slice(0, 8) + "..." + tx_hash.slice(-8)}</a>`,
                  title: "Transaction reverted!",
                });
              }
            }

            reject(err);
          });
      });
    },

    async resetOrganizationState({ commit }: any): Promise<void> {
      commit("RESET_ORGANIZATION_STATE", cloneDeep(INITIAL_STATE));
    },
  },
};
