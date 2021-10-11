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
import { onBeforeMount, onMounted } from "vue";
import { useEthereum } from "./composables/ethereum";
import Web3 from "web3";

const { state: ethereum } = useEthereum();
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

onBeforeMount(async () => {
  await ethereum.initialize();
});

onMounted(() => {
  console.log(web3);
});
</script>
