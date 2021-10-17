<template>
  <div>
    <div id="nav">
      <router-link to="/">
        Home
      </router-link>
      |
      <router-link to="/about">
        About
      </router-link>
    </div>

    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from "@vue/composition-api";
import { useEthereum } from "./composables/ethereum";
import { vm } from "./lib/globals";

export default defineComponent({
  name: "App",
  setup() {
    const { state: ethereum } = useEthereum();

    onMounted(async () => {
      vm().root.proxy.$nextTick(async () => {
        await ethereum.requestAccounts();
        ethereum.setListeners();
      });
    });

    onUnmounted(async () => {
      ethereum.removeListeners();
    });
  },
});
</script>
