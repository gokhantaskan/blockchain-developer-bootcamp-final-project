<template>
  <div
    id="app"
    v-loading="loading"
  >
    <div v-if="ethereum.chainId && ethereum.allowedChains.includes(ethereum.chainId)">
      <Navbar />

      <div class="app-wrapper">
        <transition
          name="fade"
          mode="out-in"
        >
          <router-view v-if="ethereum.selectedAddress" />
        </transition>
      </div>
    </div>

    <div v-else-if="!ethereum.isMetaMask">
      <div class="cover-whole d-flex flex-column align-items-center justify-content-center">
        <img
          src="https://raw.githubusercontent.com/MetaMask/brand-resources/c3c894bb8c460a2e9f47c07f6ef32e234190a7aa/SVG/metamask-fox.svg"
          alt="Just a fox"
          width="120"
        />
        <p>Please install MetaMask in order to continue!</p>
        <a
          class="el-button el-button--primary is-round"
          href="https://metamask.io/download.html"
        >Download MetaMask</a>
      </div>
    </div>

    <div v-else>
      <div class="cover-whole d-flex flex-column align-items-center justify-content-center">
        <p class="mt-0">
          Please select a correct network in order to continue!
        </p>
        <p class="m-0">
          Allowed Networks: {{ ethereum.allowedChains.join(", ") }}
          <span
            v-if="ethereum.chainId"
          >{{ ` - Current Network: ${ethereum.chainId}` }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from "vue-demi";
import { useEthereum } from "./composables/ethereum";
import { vm } from "./lib/globals";

export default defineComponent({
  name: "App",
  components: {
    Navbar: () => import("@/components/Navbar.vue"),
  },
  setup() {
    const { state: ethereum } = useEthereum();
    const root = vm();
    const loading = ref(false);

    onMounted(
      async () => {
        loading.value = true;

        await ethereum.initialize();
        ethereum.setAllowedChains(["0x539", "0x3", "0x4"]);

        if (ethereum.isConnected) {
          await ethereum.requestAccounts();
          if (ethereum.setListeners !== undefined) ethereum.setListeners();

          if (root) {
            root.$nextTick(() => {
              watch(
                () => ethereum.selectedAddress,
                async newVal => {
                  if (newVal) {
                    await root.$store.dispatch("setSelectedAddress", newVal);

                    await root.$store.dispatch("isUser")
                      .then(res => {
                        if (res) { // Is User
                          root.$store.dispatch("user/setUser");
                          root.$store.dispatch("user/setOrganizations");
                        } else { // Not User
                          root.$store.dispatch("user/resetUserState");
                        }
                      });
                  }
                },
                {
                  immediate: true,
                }
              );
            });
          }
        }

        loading.value = false;
      }
    );

    onUnmounted(
      async () => {
        if (ethereum.removeListeners !== undefined) ethereum.removeListeners();
      }
    );

    return { ethereum, loading };
  },
});
</script>
