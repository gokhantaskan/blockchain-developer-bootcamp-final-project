<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from "vue";

interface Props {
  msg?: string
}

withDefaults(defineProps<Props>(), {
  msg: "Web3.js",
});
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>
