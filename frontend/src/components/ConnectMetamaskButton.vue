<template>
  <button
    class="connect-metamask-button"
    :disabled="!!ethereum.accounts[0] || !!ethereum.selectedAddress"
    @click="ethereum.requestAccounts"
  >
    <span class="d-block">
      {{ ethereum.accounts.length || ethereum.selectedAddress ? "Connected to Metamask" : "Connect to Metamask" }}
    </span>

    <span
      class="d-block text-right text-dark-l2"
      v-if="ethereum.selectedAddress"
    >
      {{ ethereum.selectedAddress.slice(0, 6) + "..." + ethereum.selectedAddress.slice(-4) }}
    </span>
  </button>
</template>

<script lang="ts">
import { useEthereum } from "@/composables/ethereum";
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "ConnectMetamaskButton",
  setup() {
    const { state: ethereum } = useEthereum();

    return { ethereum };
  },
});
</script>
