<template>
  <div class="update-user-form">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        id="update-user-form"
        @submit.prevent="handleSubmit(updateUser)"
        novalidate
      >
        <div class="col-12 mb-4">
          <el-alert
            type="info"
            show-icon
            :closable="false"
          >
            <span
              class="d-block"
            >If you want to remove your e-mail and/or phone, clear the fields and submit the form.</span>
          </el-alert>
        </div>

        <div class="row">
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
import { defineComponent, onMounted, reactive } from "vue-demi";
import { vm } from "@/lib/globals";
import { Gender } from "@/lib/types";

export default defineComponent({
  name: "UpdateUserForm",
  components: {
    GenderInput: () => import("../../GenderInput.vue"),
  },
  setup(_props, { emit }) {
    const root = vm();

    const form = reactive({
      email: "",
      phone: "",
    });

    onMounted(() => {
      const userDetails = vm()?.$store.state.user.details;

      form.email = userDetails.email;
      form.phone = userDetails.phone;
    });

    const updateUser = async () => {
      emit("updating", true);

      await root?.$store.dispatch("user/updateUser", { ...form })
        .then(res => {
          emit("updated", true);
          console.log(res);
        })
        .catch(err => console.error(err));

      emit("updating", false);
    };

    return { form, updateUser, Gender };
  },
});
</script>
