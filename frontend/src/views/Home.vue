<template>
  <div class="home">
    <HelloWorld />
  </div>

  <div>
    <button
      :disabled="!isMetaMask()"
      @click="requestAccounts"
    >
      {{ isConnected() ? "Connected to Metamask" : "Connect to Metamask" }}
    </button>

    <div v-if="isMetaMask()">
      {{ accounts }}
    </div>
    <div v-else>
      Please install MetaMask extension to continue
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useEthereum } from "@/composables/ethereum";
import HelloWorld from "@/components/HelloWorld.vue";

export default defineComponent({
  name: "Home",
  components: {
    HelloWorld,
  },
  setup() {
    const { isMetaMask, isConnected, requestAccounts, accounts } = useEthereum();

    return {
      isMetaMask,
      isConnected,
      requestAccounts,
      accounts,
    };
  },
});
</script>

<style scoped>
div {
  margin-top: 1rem;
}
</style>
