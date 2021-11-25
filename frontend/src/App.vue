<template>
  <div
    id="app"
    v-loading="loading"
  >
    <div v-if="ethereum.chainId && ethereum.allowedChains.includes(ethereum.chainId)">
      <div class="navigation">
        <div class="container">
          <PageHeader title="Sertifie.me">
            <template #helper>
              <span class="d-block">
                Selected Account:{{ " " }}
                <Clipboard
                  :text="ethereum.selectedAddress"
                  address
                  toggle
                />
              </span>
              <span class="d-block">Selected Chain: {{ ethereum.chainId }} [{{ ethereum.chainName }}]</span>
            </template>
          </PageHeader>
        </div>
      </div>
      <transition
        name="fade"
        mode="out-in"
      >
        <router-view />
      </transition>
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
    PageHeader: () => import("@/components/PageHeader.vue"),
    Clipboard: () => import("@/components/Clipboard.vue"),
  },
  setup() {
    const { state: ethereum } = useEthereum();
    const root = vm();
    const loading = ref(false);

    onMounted(
      async () => {
        loading.value = true;

        ethereum.setAllowedChains(["0x539", "0x4"]);
        await ethereum.requestAccounts();
        if (ethereum.setListeners !== undefined) ethereum.setListeners();

        if (root) {
          root.$nextTick(() => {
            watch(
              () => ethereum.selectedAddress,
              async newVal => {
                root.$store.dispatch("user/setSelectedAddress", newVal);

                await root.$store.dispatch("user/isUser")
                  .then(res => {
                    if (res) { // Is User
                      root.$store.dispatch("user/setUser");
                    } else { // Not User
                      root.$store.dispatch("user/resetUserState");
                    }
                  })
                  .finally(() => { loading.value = false });
              },
              {
                immediate: true,
              }
            );
          });
        }
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
