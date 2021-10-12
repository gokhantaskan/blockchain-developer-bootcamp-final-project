<template>
  <div id="nav">
    <router-link to="/">
      Home
    </router-link> |
    <router-link to="/about">
      About
    </router-link>
  </div>

  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useEthereum } from "./composables/ethereum";

const { state: ethereum } = useEthereum();

onMounted(async () => {
  await ethereum.initialize();
});
</script>
