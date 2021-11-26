<template>
  <div class="create-organization">
    <div class="d-flex align-items-center justify-content-start mb-4">
      <el-button
        @click="$router.go(-1)"
        size="small"
      >
        <i class="el-icon-back"></i>
      </el-button>

      <h2 class="m-0 ms-2">
        Create Organization Profile
      </h2>
    </div>

    <el-card shadow="never">
      <CreateOrganizationForm @created="afterCreate" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { vm } from "@/lib/globals";
import { Message } from "element-ui";
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "CreateOrganization",
  components: {
    CreateOrganizationForm: () => import("@/components/forms/organizations/CreateOrganizationForm.vue"),
  },
  setup() {
    const root = vm();

    const afterCreate = async () => {
      if (root) {
        root.$store.dispatch("user/setOrganization");

        Message({
          message: "Organization created successfully!",
          type: "success",
          duration: 5000,
        });

        root.$router.push({ name: "Home" });
      }
    };

    return {
      afterCreate,
    };
  },
});
</script>
