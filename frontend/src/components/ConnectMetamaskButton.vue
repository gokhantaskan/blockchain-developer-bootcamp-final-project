<template>
  <button
    class="connect-metamask-button"
    :disabled="!!ethereum.accounts[0] || !!ethereum.selectedAddress"
    @click="ethereum.requestAccounts"
  >
    {{ ethereum.accounts.length || ethereum.selectedAddress ? "Connected to Metamask" : "Connect to Metamask" }}
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
