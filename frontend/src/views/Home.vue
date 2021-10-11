<template>
  <div class="home">
    <suspense>
      <template #default>
        <HelloWorld />
      </template>

      <template #fallback>
        <p>Loading...</p>
      </template>
    </suspense>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";

export default defineComponent({
  name: "Home",
  components: {
    HelloWorld: defineAsyncComponent(() => import("../components/HelloWorld.vue")),
  },
});
</script>
