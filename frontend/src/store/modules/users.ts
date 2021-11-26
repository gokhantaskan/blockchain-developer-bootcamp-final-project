import Vue from "vue";
import { web3, web3UserContract } from "@/lib/web3";
import { Message, Notification } from "element-ui";
import { ITransactionReceipt } from "@/lib/types/web3";

import { cloneDeep } from "lodash";
import { IOrganizationDetails, IOrganizationDetailsRes, IOrganizationFormData, IUserDetails, IUserFormData } from "@/lib/types";

const INITIAL_STATE = {
  details: {
    firstName: "",
    lastName: "",
    nationalId: "",
    gender: -1,
    email: "",
    phone: "",
  },
  organizations: [] as IOrganizationDetails[],
  selectedAddress: "",
  detailsLoaded: false,
  organizationsLoaded: false,
};

const STATE = cloneDeep(INITIAL_STATE);

export const userModule = {
  namespaced: true,

  state: STATE,

  mutations: {
    SET_SELECTED_ADDRESS(state: typeof STATE, payload: string) {
      Vue.set(state, "selectedAddress", payload);
    },

    SET_USER_DETAILS(state: typeof STATE, payload: Partial<IUserDetails>) {
      if (typeof payload.firstName === "string") Vue.set(state.details, "firstName", payload.firstName);
      if (typeof payload.lastName === "string") Vue.set(state.details, "lastName", payload.lastName);
      if (typeof payload.nationalId === "string") Vue.set(state.details, "nationalId", payload.nationalId);
      if (typeof payload.gender === "string") Vue.set(state.details, "gender", Number(payload.gender));
      if (typeof payload.email === "string") Vue.set(state.details, "email", payload.email);
      if (typeof payload.phone === "string") Vue.set(state.details, "phone", payload.phone);

      Vue.set(state, "detailsLoaded", true);
    },

    RESET_USER_STATE(state: typeof STATE, payload: typeof INITIAL_STATE) {
      Vue.set(state, "details", payload.details);
      Vue.set(state, "organizations", payload.organizations);
      Vue.set(state, "detailsLoaded", payload.detailsLoaded);
      Vue.set(state, "organizationsLoaded", payload.organizationsLoaded);
    },

    SET_USER_ORGANIZATIONS(state: typeof STATE, payload: Partial<IUserDetails>) {
      Vue.set(state, "organizations", payload);
      Vue.set(state, "organizationsLoaded", true);
    },
  },

  actions: {
    setSelectedAddress({ commit }: any, payload: string) {
      commit("SET_SELECTED_ADDRESS", web3.utils.toChecksumAddress(payload));
    },

    isUser({ dispatch, state }: any) {
      return new Promise<boolean>((resolve, reject) => {
        web3UserContract.methods
          .isUser(state.selectedAddress)
          .call({ from: state.selectedAddress })
          .then((res: boolean) => {
            console.log("isUser", res);
            resolve(res);
          })
          .catch((err: any) => {
            dispatch("resetUserState");

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

    createUser({ dispatch, state }: any, payload: IUserFormData): Promise<{ res: ITransactionReceipt }> {
      return new Promise((resolve, reject) => {
        let receipt: ITransactionReceipt;
        let tx_hash = "";
        let infoNot: any = null;

        web3UserContract.methods
          .createUser(payload.firstName, payload.lastName, payload.nationalId, payload.email, payload.phone, payload.gender)
          .send({ from: state.selectedAddress })
          .once("transactionHash", (txHash: string) => {
            tx_hash = txHash;

            infoNot = Notification.info({
              position: "bottom-left",
              duration: 0,
              dangerouslyUseHTMLString: true,
              message: `Create User:  <a href="https://rinkeby.etherscan.io/tx/${tx_hash}" target="_blank">${txHash.slice(0, 8) + "..." + txHash.slice(-8)}</a>`,
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
              message: `Create User: <a href="https://rinkeby.etherscan.io/tx/${tx_hash}" target="_blank">${tx_hash.slice(0, 8) + "..." + tx_hash.slice(-8)}</a>`,
              title: "Transaction confirmed!",
            });

            dispatch("setUser");

            resolve({ res });
          })
          .catch(async (err: any) => {
            await web3.eth.getTransactionReceipt(tx_hash, (error, transactionReceipt) => {
              if (error) console.error("Error during getting the receipt: ", error);
              receipt = transactionReceipt as ITransactionReceipt;
            });

            if (err.code === -32603) {
              Message({
                type: "error",
                message: "MetaMask RPC Error [-32603]: The tx doesn't have the correct nonce!",
                duration: 5000,
              });
            } else {
              Message({
                type: "error",
                message: err.message,
                duration: 5000,
              });
            }

            if (tx_hash.length) {
              infoNot.close();

              Notification.error({
                position: "bottom-left",
                duration: 0,
                dangerouslyUseHTMLString: true,
                message: `Create User: <a href="https://rinkeby.etherscan.io/tx/${tx_hash}" target="_blank">${tx_hash.slice(0, 8) + "..." + tx_hash.slice(-8)}</a>`,
                title: "Transaction reverted!",
              });
            }

            reject(err);
          });
      });
    },

    setUser({ commit, dispatch, state }: any): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        web3UserContract.methods
          .readUser()
          .call({ from: state.selectedAddress })
          .then((res: any) => {
            commit("SET_USER_DETAILS", res);

            resolve(res);
          })
          .catch((err: any) => {
            Message.error({
              message: err.message,
              duration: 0,
              showClose: true,
            });

            dispatch("resetUserState");

            reject(err);
          });
      });
    },

    updateUser({ dispatch, state }: any, payload: Partial<IUserFormData>): Promise<{ res: ITransactionReceipt }> {
      return new Promise((resolve, reject) => {
        let receipt: ITransactionReceipt;
        let tx_hash = "";
        let infoNot: any;

        web3UserContract.methods
          .updateUser(payload.email, payload.phone)
          .send({ from: state.selectedAddress })
          .once("transactionHash", (txHash: string) => {
            tx_hash = txHash;

            infoNot = Notification.info({
              position: "bottom-left",
              duration: 0,
              dangerouslyUseHTMLString: true,
              message: `Update User:  <a href="https://rinkeby.etherscan.io/tx/${tx_hash}" target="_blank">${txHash.slice(0, 8) + "..." + txHash.slice(-8)}</a>`,
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
              message: `Update user:  <a href="https://rinkeby.etherscan.io/tx/${tx_hash}" target="_blank">${tx_hash.slice(0, 8) + "..." + tx_hash.slice(-8)}</a>`,
              title: "Transaction confirmed!",
            });

            dispatch("setUser");

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
                message: `Update user:  <a href="https://rinkeby.etherscan.io/tx/${tx_hash}" target="_blank">${tx_hash.slice(0, 8) + "..." + tx_hash.slice(-8)}</a>`,
                title: "Transaction reverted!",
              });
            }

            reject(err);
          });
      });
    },

    deleteUser({ dispatch, state }: any): Promise<{ res: ITransactionReceipt }> {
      return new Promise((resolve, reject) => {
        let receipt: ITransactionReceipt;
        let tx_hash = "";
        let infoNot: any;

        web3UserContract.methods
          .deleteUser()
          .send({ from: state.selectedAddress })
          .once("transactionHash", (txHash: string) => {
            tx_hash = txHash;

            infoNot = Notification.info({
              position: "bottom-left",
              duration: 0,
              dangerouslyUseHTMLString: true,
              message: `Remove User:  <a href="https://rinkeby.etherscan.io/tx/${tx_hash}">${txHash.slice(0, 8) + "..." + txHash.slice(-8)}</a>`,
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
              message: `Remove User:  <a href="https://rinkeby.etherscan.io/tx/${tx_hash}">${tx_hash.slice(0, 8) + "..." + tx_hash.slice(-8)}</a>`,
              title: "Transaction confirmed!",
            });

            dispatch("resetUserState");
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
                  message: `Remove User: <a href="https://rinkeby.etherscan.io/tx/${tx_hash}">${tx_hash.slice(0, 8) + "..." + tx_hash.slice(-8)}</a>`,
                  title: "Transaction reverted!",
                });
              }
            }

            reject(err);
          });
      });
    },

    async resetUserState({ commit }: any): Promise<void> {
      commit("RESET_USER_STATE", cloneDeep(INITIAL_STATE));
    },

    // ! Organizations
    createOrganization({ dispatch, state }: any, payload: IOrganizationFormData): Promise<{ res: ITransactionReceipt }> {
      return new Promise((resolve, reject) => {
        let receipt: ITransactionReceipt;
        let tx_hash = "";
        let infoNot: any = null;

        web3UserContract.methods
          .createOrganization(payload.name, payload.registrationId, payload.email, payload.phone, payload.admins)
          .send({ from: state.selectedAddress })
          .once("transactionHash", (txHash: string) => {
            tx_hash = txHash;

            infoNot = Notification.info({
              position: "bottom-left",
              duration: 0,
              dangerouslyUseHTMLString: true,
              message: `Create Organization:  <a href="https://rinkeby.etherscan.io/tx/${tx_hash}" target="_blank">${txHash.slice(0, 8) + "..." + txHash.slice(-8)}</a>`,
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
              message: `Create Organization: <a href="https://rinkeby.etherscan.io/tx/${tx_hash}" target="_blank">${tx_hash.slice(0, 8) + "..." + tx_hash.slice(-8)}</a>`,
              title: "Transaction confirmed!",
            });

            dispatch("setUser");

            resolve({ res });
          })
          .catch(async (err: any) => {
            await web3.eth.getTransactionReceipt(tx_hash, (error, transactionReceipt) => {
              if (error) console.error("Error during getting the receipt: ", error);
              receipt = transactionReceipt as ITransactionReceipt;
            });

            if (err.code === -32603) {
              Message({
                type: "error",
                message: "MetaMask RPC Error [-32603]: The tx doesn't have the correct nonce!",
                duration: 5000,
              });
            } else {
              Message({
                type: "error",
                message: err.message,
                duration: 5000,
              });
            }

            if (tx_hash.length) {
              infoNot.close();

              Notification.error({
                position: "bottom-left",
                duration: 0,
                dangerouslyUseHTMLString: true,
                message: `Create Organization: <a href="https://rinkeby.etherscan.io/tx/${tx_hash}" target="_blank">${tx_hash.slice(0, 8) + "..." + tx_hash.slice(-8)}</a>`,
                title: "Transaction reverted!",
              });
            }

            reject(err);
          });
      });
    },

    setOrganizations({ commit, dispatch, state }: any): Promise<string[]> {
      return new Promise((resolve, reject) => {
        web3UserContract.methods
          .getOrganizations()
          .call({ from: state.selectedAddress })
          .then(async (res: string[]) => {
            const arr = [] as IOrganizationDetails[];

            if (res.length) {
              for (let i = 0; i < res.length; i++) {
                const contractAddress = res[i];

                await web3UserContract.methods
                  .getOrganizationDetails(contractAddress)
                  .call({ from: state.selectedAddress })
                  .then((res: IOrganizationDetailsRes) => {
                    arr.push({
                      name: res._name,
                      registrationId: res._registrationId,
                      email: res._email,
                      phone: res._phone,
                      admins: res._admins,
                      owner: res._owner,
                      contractAddress,
                    });
                  });
              }
            }

            commit("SET_USER_ORGANIZATIONS", arr);
            resolve(res);
          })
          .catch((err: any) => {
            Message.error({
              message: err.message,
              duration: 0,
              showClose: true,
            });

            dispatch("resetUserState");

            reject(err);
          });
      });
    },
  },

  getters: {
    ownedOrganizations: (state: typeof STATE) => {
      return state.organizations.filter(organization => organization.owner === state.selectedAddress);
    },

    attendedOrganizations: (state: typeof STATE) => {
      return state.organizations.filter(organization => organization.admins.includes(state.selectedAddress));
    },
  },
};
