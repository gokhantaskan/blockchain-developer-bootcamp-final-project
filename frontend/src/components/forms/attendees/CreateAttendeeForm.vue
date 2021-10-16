<template>
  <div class="create-attendee-form">
    <el-card size="huge">
      <template #header>
        Create Attendee Profile
      </template>

      <el-form
        label-position="top"
      >
        <div class="row">
          <div class="col-12 col-md-6">
            <el-form-item label="First Name">
              <el-input
                id="firstname"
                v-model="form.firstName"
                type="text"
              />
            </el-form-item>
          </div>

          <div class="col-12 col-md-6">
            <el-form-item label="Last Name">
              <el-input
                id="lastname"
                v-model="form.lastName"
              />
            </el-form-item>
          </div>

          <div class="col-12 col-md-6">
            <el-form-item label="National ID">
              <el-input
                id="nationalid"
                v-model="form.nationalId"
              />
            </el-form-item>
          </div>

          <div class="col-12 col-md-6">
            <el-form-item label="E-mail">
              <el-input
                id="email"
                v-model="form.email"
              />
            </el-form-item>
          </div>

          <div class="col-12 col-md-6">
            <el-form-item label="Phone">
              <el-input
                id="phone"
                v-model="form.phone"
              />
            </el-form-item>
          </div>

          <div class="col-12">
              <el-button
                type="primary"
                @click="createAttendee"
              >
                Submit
              </el-button>
          </div>
        </div>
      </el-form>
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

    const createAttendee = () => {};

    return { form, createAttendee };
  },
});
</script>
