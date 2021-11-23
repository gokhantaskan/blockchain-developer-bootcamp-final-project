<template>
  <div class="create-user-form">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        @submit.prevent="handleSubmit(createUser)"
        novalidate
      >
        <div class="row">
          <div class="col-12 mb-4">
            <el-alert
              type="info"
              show-icon
              :closable="false"
            >
              Only
              <strong>e-mail</strong> and
              <strong>phone number</strong> can be updated later.
              Please submit your form carefully.
            </el-alert>
          </div>

          <div class="col-12 col-md-6">
            <FormItem
              v-model="form.firstName"
              id="firstName"
              label="First Name"
              vv-name="First Name"
              vv-rules="required|min:2|alpha_spaces"
              message="At least 2 characters"
              placeholder="ex. John"
              required
            />
          </div>

          <div class="col-12 col-md-6">
            <FormItem
              v-model="form.lastName"
              id="lastName"
              label="Last Name"
              vv-name="Last Name"
              vv-rules="required|min:2|alpha"
              message="At least 2 characters"
              placeholder="ex. Doe"
              required
            />
          </div>

          <div class="col-12 col-md-6">
            <FormItem
              v-model="form.nationalId"
              id="nationalId"
              label="National ID"
              vv-name="National ID"
              vv-rules="required"
              placeholder="ex. XYZ-12345"
              show-password
              required
            />
          </div>

          <div class="col-12 col-md-6">
            <ValidationProvider
              rules="required"
              name="Gender"
              :bails="false"
              skip-if-empty
              v-slot="{ errors }"
            >
              <GenderInput
                v-model="form.gender"
                :errors="errors"
              />
            </ValidationProvider>
          </div>

          <div class="col-12 col-md-6">
            <FormItem
              v-model="form.email"
              id="email"
              label="E-mail"
              vv-name="E-mail"
              vv-rules="email"
            />
          </div>

          <div class="col-12 col-md-6">
            <FormItem
              v-model="form.phone"
              id="phone"
              label="Phone"
              vv-name="Phone"
            />
          </div>

          <div class="col-12 pt-3">
            <el-button
              type="primary"
              native-type="submit"
              :loading="loading"
            >
              Submit
            </el-button>
          </div>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue-demi";
import { useEthereum } from "@/composables/ethereum";
import { Message, Notification } from "element-ui";
import { web3, web3UserContract } from "@/lib/web3";
import { Gender } from "@/lib/types";
import { ITransactionReceipt } from "@/lib/types/web3";

export default defineComponent({
  name: "CreateUserForm",
  components: {
    GenderInput: () => import("../../GenderInput.vue"),
  },
  setup(_props, { emit }) {
    const { state: ethereum } = useEthereum();

    const loading = ref(false);

    const form = reactive({
      firstName: "",
      lastName: "",
      nationalId: "",
      email: "",
      phone: "",
      gender: undefined,
    });

    const createUser = async () => {
      loading.value = true;
      let receipt: ITransactionReceipt;
      let tx_hash = "";
      let infoNot: any = null;

      await web3UserContract.methods
        .createUser(form.firstName, form.lastName, form.nationalId, form.email, form.phone, form.gender)
        .send({ from: ethereum.selectedAddress })
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
          console.log(receipt);
        })
        .then(() => {
          infoNot.close();

          Notification.success({
            position: "bottom-left",
            duration: 0,
            dangerouslyUseHTMLString: true,
            message: `Create User: <a href="https://rinkeby.etherscan.io/tx/${tx_hash}" target="_blank">${tx_hash.slice(0, 8) + "..." + tx_hash.slice(-8)}</a>`,
            title: "Transaction confirmed!",
          });

          emit("created", true);
        })
        .catch(async (error: any) => {
          await web3.eth.getTransactionReceipt(tx_hash, (error, transactionReceipt) => {
            if (error) console.error(error);
            receipt = transactionReceipt as ITransactionReceipt;
          });

          console.log(receipt);

          Message({
            type: "error",
            message: error.reason,
            duration: 5000,
          });

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
        })
        .finally(() => {
          loading.value = false;
        });
    };

    return { form, loading, createUser, Gender };
  },
});
</script>
