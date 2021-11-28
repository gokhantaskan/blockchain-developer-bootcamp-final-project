<template>
  <div class="d-inline-flex align-items-center">
    <template v-if="text.length">
      <template v-if="address">
        {{ visible ? text : text.slice(0, 6) + "..." + text.slice(-4) }}
      </template>
      <template v-else-if="email">
        {{ visible ? text : maskEmail(text) }}
      </template>
      <template v-else>
        {{ visible ? text : "****" }}
      </template>
      <el-button
        class="icon-button"
        :disabled="copied"
        @click="copy(text)"
        icon="el-icon-copy-document"
        type="info"
        size="small"
        plain
      ></el-button>

      <el-button
        class="icon-button"
        v-if="toggle"
        @click="toggleVisibility"
        icon="el-icon-view"
        type="info"
        size="small"
        plain
      ></el-button>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue-demi";
import { useClipboard } from "@vueuse/core";
import { Message } from "element-ui";
import { maskEmail } from "@/helpers/utils";

export default defineComponent({
  name: "CLipboard",
  props: {
    toggle: {
      type: Boolean,
      default: false,
    },
    address: {
      type: Boolean,
      default: false,
    },
    email: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: "",
      required: true,
    },
  },
  setup() {
    const { copy, copied } = useClipboard();
    const visible = ref(false);

    const toggleVisibility = () => {
      visible.value = !visible.value;
    };

    watch(copied, newVal => {
      if (newVal) {
        Message.success({
          message: "Address copied to the clipboard!",
        });
      }
    });

    return { copy, copied, visible, maskEmail, toggleVisibility };
  },
});
</script>
