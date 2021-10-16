<template>
  <div class="create-attendee-form">
    <el-card size="huge">
      <template #header>
        Create Attendee Profile
      </template>

      <ValidationObserver v-slot="{ handleSubmit }">
        <form
          @submit.prevent="handleSubmit(createAttendee)"
          novalidate
        >
          <div class="row">
            <div class="col-12 col-md-6">
              <FormItem
                v-model="form.firstName"
                id="firstName"
                label="First Name"
                vv-name="First Name"
                vv-rules="required|min:2"
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
                vv-rules="required|min:2"
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
                vv-rules="required|email"
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

            <div class="col-12">
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
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";

export default defineComponent({
  name: "CreateAttendeeForm",
  setup() {
    const form = reactive({
      firstName: null,
      lastName: null,
      nationalId: null,
      email: null,
      phone: null,
    });

    const createAttendee = () => { };

    return { form, createAttendee };
  },
});
</script>
