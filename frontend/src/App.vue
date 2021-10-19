<template>
  <div>
    <div class="container">
      <PageHeader title="Sertifie.me" />
    </div>

    <transition
      name="fade"
      mode="out-in"
    >
      <router-view />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from "@vue/composition-api";
import { useEthereum } from "./composables/ethereum";
import { vm } from "./lib/globals";

export default defineComponent({
  name: "App",
  components: {
    PageHeader: () => import("@/components/PageHeader.vue"),
  },
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
