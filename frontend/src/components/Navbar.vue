<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar__brand">
        Sertifie.Me
      </div>

      <div class="navbar__nav">
        <ul class="navbar__nav-list">
          <router-link to="/" :exact="true">
            Profile
          </router-link>
          <router-link to="/organizations">
            Organizations
          </router-link>
        </ul>
      </div>

      <div class="navbar__helper">
        <ConnectMetamaskButton />

        <!-- <span class="d-block">
          Selected Account:{{ " " }}
          <Clipboard
            :text="ethereum.selectedAddress"
            address
            toggle
          />
        </span>
        <span
          class="d-block"
        >
          Selected Chain: {{ ethereum.chainId }} [{{ ethereum.chainName }}]
        </span> -->
      </div>
    </div>
  </nav>
</template>

<script>
import { useEthereum } from "@/composables/ethereum";
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "Navbar",
  components: {
    ConnectMetamaskButton: () => import("@/components/ConnectMetamaskButton.vue"),
    Clipboard: () => import("@/components/Clipboard.vue"),
  },
  setup() {
    const { state: ethereum } = useEthereum();

    return {
      ethereum,
    };
  }
});
</script>
