<template>
  <div class="edit-user-form">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        id="edit-user-form"
        @submit.prevent="handleSubmit(updateUser)"
        novalidate
      >
        <div class="row">
          <div class="col-12 col-lg-6">
            <FormItem
              v-model="form.firstName"
              id="firstName"
              label="First Name"
              vv-name="First Name"
              vv-rules="required|min:2|alpha_spaces"
              message="At least 2 characters"
              required
            />
          </div>

          <div class="col-12 col-lg-6">
            <FormItem
              v-model="form.lastName"
              id="lastName"
              label="Last Name"
              vv-name="Last Name"
              vv-rules="required|min:2|alpha"
              message="At least 2 characters"
              required
            />
          </div>

          <div class="col-12 col-lg-6">
            <FormItem
              v-model="form.nationalId"
              id="nationalId"
              label="National ID"
              vv-name="National ID"
              vv-rules="required"
              show-password
              required
            />
          </div>

          <div class="col-12 col-lg-6">
            <FormItem
              v-model="form.email"
              id="email"
              label="E-mail"
              vv-name="E-mail"
              vv-rules="email"
            />
          </div>

          <div class="col-12 col-lg-6">
            <FormItem
              v-model="form.phone"
              id="phone"
              label="Phone"
              vv-name="Phone"
            />
          </div>

          <div class="col-12 col-md-6">
            <GenderInput v-model="form.gender" />
          </div>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue-demi";
import { useEthereum } from "@/composables/ethereum";
import { Message, Notification } from "element-ui";
import { web3UserContract } from "@/lib/web3";
import { vm } from "@/lib/globals";
import { Gender } from "@/lib/types";

export default defineComponent({
  name: "UpdateUserForm",
  components: {
    GenderInput: () => import("../../GenderInput.vue"),
  },
  setup(_props, { emit }) {
    const { state: ethereum } = useEthereum();
    // const tx_hash = ref("");
    const form = reactive({
      firstName: "",
      lastName: "",
      nationalId: "",
      email: "",
      phone: "",
      gender: 0,
    });

    const updateUser = () => {
      emit("updating", true);
      let tx_hash = "";

      web3UserContract.methods
        .updateUser(form.firstName, form.lastName, form.nationalId, form.email, form.phone, form.gender)
        .send({ from: ethereum.selectedAddress })
        .once("transactionHash", (txHash: string) => {
          tx_hash = txHash;

          Notification.info({
            position: "bottom-left",
            duration: 0,
            dangerouslyUseHTMLString: true,
            message: `Update User:  <a href="https://rinkeby.etherscan.io/tx/${tx_hash}">${txHash.slice(0, 8) + "..." + txHash.slice(-8)}</a>`,
            title: "Transaction submitted!",
          });
        })
        /* confNumber is a dynamic number increasing over time */
        .on("confirmation", (confNumber: number, _receipt: any, latestBlockHash: any) => {
          console.log("conf. number: ", confNumber);
          console.log("latest block hash: ", latestBlockHash);
        })
        .then((res: any) => {
          Notification.success({
            position: "bottom-left",
            duration: 0,
            dangerouslyUseHTMLString: true,
            message: `Update user:  <a href="https://rinkeby.etherscan.io/tx/${tx_hash}">${tx_hash.slice(0, 8) + "..." + tx_hash.slice(-8)}</a>`,
            title: "Transaction confirmed!",
          });

          emit("updated", true);
        })
        .catch((error: any) => {
          Message({
            type: "error",
            message: error.message,
            duration: 5000,
          });

          if (tx_hash.length) {
            Notification.error({
              position: "bottom-left",
              duration: 0,
              dangerouslyUseHTMLString: true,
              message: `Update user:  <a href="https://rinkeby.etherscan.io/tx/${tx_hash}">${tx_hash.slice(0, 8) + "..." + tx_hash.slice(-8)}</a>`,
              title: "Transaction reverted!",
            });
          }
        })
        .finally(() => {
          emit("updating", false);
        });
    };

    onMounted(() => {
      const userDetails = vm().root.proxy.$store.state.user.details;

      form.firstName = userDetails.firstName;
      form.lastName = userDetails.lastName;
      form.nationalId = userDetails.nationalId;
      form.gender = userDetails.gender;
      form.email = userDetails.email;
      form.phone = userDetails.phone;
    });

    return { form, updateUser, Gender };
  },
});
</script>
