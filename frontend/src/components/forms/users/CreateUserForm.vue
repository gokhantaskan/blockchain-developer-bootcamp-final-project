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
              <span class="d-block">
                Only
                <strong>e-mail</strong> and
                <strong>phone number</strong> can be updated after you create your profile.
              </span>
              <span class="d-block">
                Later on, you can
                <strong>delete</strong> and
                <strong>create</strong> your profile
                <strong>again</strong>.
              </span>
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
import { Gender } from "@/lib/types";
import { vm } from "@/lib/globals";

export default defineComponent({
  name: "CreateUserForm",
  components: {
    GenderInput: () => import("../../GenderInput.vue"),
  },
  setup(_props, { emit }) {
    const { state: ethereum } = useEthereum();
    const root = vm();
    const loading = ref(false);

    const form = reactive({
      firstName: "",
      lastName: "",
      nationalId: "",
      email: "",
      phone: "",
      gender: undefined,
      selectedAddress: ethereum.selectedAddress,
    });

    const createUser = async () => {
      loading.value = true;

      await root?.$store.dispatch("user/createUser", { ...form })
        .then(res => {
          console.log(res);
          emit("created", true);
        })
        .catch(err => console.log(err));

      loading.value = false;
    };

    return { form, loading, createUser, Gender };
  },
});
</script>
