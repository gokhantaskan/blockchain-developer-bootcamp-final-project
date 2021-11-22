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
    const root = vm().root.proxy;

    const afterCreate = async () => {
      root.$store.dispatch("user/getUser", useEthereum().state.selectedAddress);

      Message({
        message: "Profile created successfully!",
        type: "success",
        duration: 5000,
      });

      root.$router.push({ name: "Home" });
    };

    return {
      afterCreate,
    };
  },
});
</script>
