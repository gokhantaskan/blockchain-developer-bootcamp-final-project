<template>
  <div class="page-header d-flex align-items-center justify-content-between">
    <component
      :is="'h' + level"
      @click="clickFn"
    >
      {{ title }}
    </component>

    <ConnectMetamaskButton />
  </div>
</template>

<script>
export default {
  name: "PageHeader",
  components: {
    ConnectMetamaskButton: () => import("./ConnectMetamaskButton.vue"),
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
};
</script>
