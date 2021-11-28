<template>
  <div class="update-organization-form">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        id="update-organization-form"
        @submit.prevent="handleSubmit(updateOrganization)"
        novalidate
      >
        <div class="row">
          <div class="col-12 col-md-6">
            <FormItem
              v-model="form.name"
              id="name"
              label="Name"
              vv-name="Name"
              vv-rules="required|min:2"
              message="At least 2 characters"
              required
            />
          </div>

          <div class="col-12 col-md-6">
            <FormItem
              v-model="form.registrationId"
              id="registrationId"
              label="Registration ID"
              vv-name="Registration ID"
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
              vv-rules="email|required"
              required
            />
          </div>

          <div class="col-12 col-md-6">
            <FormItem
              v-model="form.phone"
              id="phone"
              label="Phone"
              vv-name="Phone"
              vv-rules="required"
              required
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

export default defineComponent({
  name: "UpdateOrganizationForm",
  setup(_props, { emit }) {
    const root = vm();

    const form = reactive({
      name: "",
      registrationId: "",
      email: "",
      phone: "",
    });

    onMounted(() => {
      const organizationDetails = vm()?.$store.state.organization.details;

      form.name = organizationDetails.name;
      form.registrationId = organizationDetails.registrationId;
      form.email = organizationDetails.email;
      form.phone = organizationDetails.phone;
    });

    const updateOrganization = async () => {
      emit("updating", true);
      await root?.$store.dispatch("organization/updateOrganization", { ...form })
        .then(res => {
          console.log(res);
          emit("updated", true);
        })
        .catch(err => console.log(err));

      emit("updating", false);
    };

    return { form, updateOrganization };
  },
});
</script>
