<template>
  <div class="home">
    <div class="container">
      <PageHeader title="Home" />
      <HelloWorld />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "Home",
  components: {
    PageHeader: () => import("@/components/PageHeader.vue"),
    HelloWorld: () => import("@/components/HelloWorld.vue"),
  },
});
</script>
