<template>
  <el-card
    key="2"
    shadow="never"
  >
    <template #header>
      <h2 class="m-0">
        Create User Profile
      </h2>
    </template>

    <CreateUserForm @created="afterCreate" />
  </el-card>
</template>

<script lang="ts">
import { useEthereum } from "@/composables/ethereum";
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
        root.$store.dispatch("user/setUser", useEthereum().state.selectedAddress);
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
