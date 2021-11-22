<template>
  <div
    class="form-item required"
    :class="[
      errors.length ? 'not-valid' : ''
    ]"
  >
    <label class="form-item__label">
      Gender
    </label>

    <el-radio-group
      :value="Number(value)"
      @input="handleChange"
      class="d-block"
    >
      <el-radio-button
        :label="Number(Gender.Male)"
        :disabled="disableAll"
      >
        Male
      </el-radio-button>
      <el-radio-button
        :label="Number(Gender.Female)"
        :disabled="disableAll"
      >
        Female
      </el-radio-button>
      <el-radio-button
        :label="Number(Gender.Transgender)"
        :disabled="disableAll"
      >
        Transgender
      </el-radio-button>
    </el-radio-group>

    <span
      class="form-item__error mt-n-1"
      v-if="errors.length"
    >{{ errors[0] }}</span>
  </div>
</template>

<script>
import { Gender } from "@/lib/types";

export default {
  name: "GenderInput",
  props: {
    value: {
      type: [Number, String],
      default: -1,
    },
    disableAll: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleChange(e) {
      this.$emit("input", e);
    },
  },
  setup() {
    return { Gender };
  },
};
</script>
