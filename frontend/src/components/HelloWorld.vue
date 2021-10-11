<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>

  <div v-if="ethereum">
    <button
      :disabled="!ethereum.isMetaMask"
      @click="ethereum.requestAccounts"
    >{{ ethereum.isConnected ? "Connected to Metamask" : "Connect to Metamask" }}</button>

    <div v-if="ethereum.isMetaMask">
      <pre><code>{{ data }}</code></pre>
    </div>
    <div v-else>Please install MetaMask extension to continue</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from "vue";
import { useEthereum } from "@/composables/ethereum";

interface Props {
  msg?: string
}

withDefaults(defineProps<Props>(), {
  msg: "Web3.js",
});

const { state: ethereum } = useEthereum();

const data = {
  accounts: ethereum.accounts,
  isMetaMask: ethereum.isMetaMask,
  isConnected: ethereum.isConnected,
  selectedAddress: ethereum.selectedAddress,
  networkVersion: ethereum.networkVersion,
  chainId: ethereum.chainId,
};
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}

div:nth-child(2) {
  margin-top: 1rem;
}
</style>
