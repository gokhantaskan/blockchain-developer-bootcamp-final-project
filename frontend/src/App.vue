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
import { onBeforeMount } from "vue";
import { useEthereum } from "./composables/ethereum";

const { ethereum, requestAccounts } = useEthereum();

onBeforeMount(() => {
  if (ethereum !== undefined) requestAccounts();
});
</script>
