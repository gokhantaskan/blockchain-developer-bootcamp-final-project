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
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "@vue/composition-api";
import { useEthereum } from "@/composables/ethereum";
import { Message, Notification } from "element-ui";
import { userContract } from "@/contracts";
import { vm } from "@/lib/globals";

export default defineComponent({
  name: "UpdateUserForm",
  setup(_props, { emit }) {
    const { state: ethereum } = useEthereum();
    const transaction = ref({});
    const form = reactive({
      firstName: "",
      lastName: "",
      nationalId: "",
      email: "",
      phone: "",
    });

    const updateUser = () => {
      emit("updating", true);

      userContract.methods
        .updateUserDetails(form.firstName, form.lastName, form.nationalId, form.email, form.phone)
        .send({ from: ethereum.selectedAddress })
        .once("transactionHash", (txHash: string) => {
          Notification.info({
            position: "bottom-left",
            duration: 0,
            message: `Tx Hash: ${txHash.slice(0, 10) + "..." + txHash.slice(-10)}`,
            title: "Transaction submitted!",
          });
        })
        .then((res: any) => {
          Notification.success({
            position: "bottom-left",
            duration: 0,
            message: `Tx Hash: ${res.transactionHash.slice(0, 10) + "..." + res.transactionHash.slice(-10)}`,
            title: "Transaction accepted!",
          });

          emit("updated", true);
        })
        .catch((error: any) => {
          Message({
            type: "error",
            message: error.message,
            duration: 5000,
          });

          console.log(error.message);
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
      form.email = userDetails.email;
      form.phone = userDetails.phone;
    });

    return { form, updateUser };
  },
});
</script>
