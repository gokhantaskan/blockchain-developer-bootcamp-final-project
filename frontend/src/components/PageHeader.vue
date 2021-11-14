<template>
  <div class="page-header mb-4">
    <div class="d-flex align-items-center justify-content-between">
      <component
        :is="'h' + level"
        @click="clickFn"
      >
        {{ title }}
      </component>
      <ConnectMetamaskButton />
    </div>

    <div>
      <slot name="helper" />
    </div>
  </div>
</template>

<script>
import { useEthereum } from "@/composables/ethereum";
import { defineComponent } from "vue-demi";
import Clipboard from "./Clipboard.vue";

export default defineComponent({
  name: "PageHeader",
  components: {
    ConnectMetamaskButton: () => import("./ConnectMetamaskButton.vue"),
    Clipboard,
  },
  props: {
    level: {
      type: String,
      default: "1",
      required: false,
    },
    title: {
      type: String,
      default: "",
      required: true,
    },
    to: {
      type: [String, Object],
      default: "/",
      required: false,
    },
  },
  methods: {
    clickFn() {
      this.$router.push(this.$props.to);
    },
  },
  setup() {
    const { state: ethereum } = useEthereum();
    return { ethereum };
  },
});
</script>
