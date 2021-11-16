<template>
  <ValidationProvider
    :vid="vvVid"
    :rules="vvRules"
    :name="vvName"
    :bails="false"
    skip-if-empty
    v-slot="{ errors }"
  >
    <div
      class="form-item"
      :class="[
        errors.length ? 'not-valid' : '',
        required ? 'required' : ''
      ]"
    >
      <label
        class="form-item__label"
        :for="id"
      >
        <slot name="label">
          {{ label }}
        </slot>
      </label>

      <el-input
        :id="id"
        :value="value"
        @input="handleInput"
        :type="type"
        :required="required"
        :placeholder="placeholder"
        v-bind="$attrs"
      >
        <slot />
      </el-input>

      <span
        class="form-item__error"
        v-if="errors.length"
      >
        {{ errors[0] }}
      </span>
      <span
        class="form-item__message"
        v-else-if="message && !errors.length"
      >
        {{ message }}
      </span>
    </div>
  </ValidationProvider>
</template>

<script>
export default {
  name: "FormItem",
  props: {
    vvVid: {
      type: String,
      default: undefined,
    },
    vvRules: {
      type: [String, Object],
      default: undefined,
    },
    vvName: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: "",
    },
    value: {
      type: [String, Number, Object],
      default: null,
    },
    message: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: "text",
    },
    placeholder: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleInput(e) {
      this.$emit("input", e);
    },
  },
};
</script>
