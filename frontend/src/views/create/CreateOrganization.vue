<template>
  <el-card shadow="never">
    <template #header>
      <h2 class="m-0">
        Create Organization Profile
      </h2>
    </template>

    <CreateOrganizationForm @created="afterCreate" />
  </el-card>
</template>

<script lang="ts">
import { useEthereum } from "@/composables/ethereum";
import { vm } from "@/lib/globals";
import { Message } from "element-ui";
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "CreateOrganization",
  components: {
    CreateOrganizationForm: () => import("@/components/forms/organizations/CreateOrganizationForm.vue"),
  },
  setup() {
    const root = vm().root.proxy;

    const afterCreate = async () => {
      root.$store.dispatch("user/getUserDetails", useEthereum().state.selectedAddress);

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
