<template>
  <div class="create-user">
    <div class="d-flex align-items-center justify-content-start mb-4">
      <el-button
        @click="$router.go(-1)"
        size="small"
      >
        <i class="el-icon-back"></i>
      </el-button>

      <h2 class="m-0 ms-2">
        Create User Profile
      </h2>
    </div>

    <el-card
      key="2"
      shadow="never"
    >
      <CreateUserForm @created="afterCreate" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { vm } from "@/lib/globals";
import { Message } from "element-ui";
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "CreateUser",
  components: {
    CreateUserForm: () => import("@/components/forms/users/CreateUserForm.vue"),
  },
  setup() {
    const root = vm();

    const afterCreate = async () => {
      if (root) {
        root.$store.dispatch("user/setUser");
        root.$router.push({ name: "Home" });

        Message({
          message: "Profile created successfully!",
          type: "success",
          duration: 5000,
        });
      }
    };

    return {
      afterCreate,
    };
  },
});
</script>
