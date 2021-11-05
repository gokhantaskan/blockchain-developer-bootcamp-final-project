<template>
  <div class="about">
    <div class="container">
      <PageHeader title="About" />
      <SendEthForm />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "About",
  components: {
    PageHeader: () => import("@/components/PageHeader.vue"),
    SendEthForm: () => import("@/components/forms/SendEthForm.vue"),
  },
  setup() {},
});
</script>
