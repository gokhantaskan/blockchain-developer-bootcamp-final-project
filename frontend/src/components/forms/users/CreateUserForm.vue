<template>
  <div class="create-user-form">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        @submit.prevent="handleSubmit(createUser)"
        novalidate
      >
        <div class="row">
          <div class="col-12 col-md-6">
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

          <div class="col-12 col-md-6">
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

          <div class="col-12 col-md-6">
            <FormItem
              v-model="form.nationalId"
              id="nationalId"
              label="National ID"
              vv-name="National ID"
              vv-rules="required"
              required
            />
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
import { defineComponent, reactive, ref } from "@vue/composition-api";
import { useEthereum } from "@/composables/ethereum";
import { Message } from "element-ui";
import { userContract } from "@/contracts";

export default defineComponent({
  name: "CreateUserForm",
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

    const createUser = () => {
      userContract.methods
        .createUser(form.firstName, form.lastName, form.nationalId, form.email, form.phone)
        .send({ from: ethereum.selectedAddress })
        .then((res: any) => {
          transaction.value = res;
          emit("created", true);
        })
        .catch((error: any) => {
          Message({
            type: "error",
            message: error.message,
            duration: 5000,
          });
        });
    };

    return { form, transaction, createUser };
  },
});
</script>
