<template>
  <div class="form-item">
    <label class="form-item__label">Gender</label>
    <el-radio-group
      :value="value"
      @input="handleChange"
      class="d-block"
    >
      <el-radio-button :label="Gender.Male">
        Male
      </el-radio-button>
      <el-radio-button :label="Gender.Female">
        Female
      </el-radio-button>
      <el-radio-button :label="Gender.Transgender">
        Transgender
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
import { Gender } from "@/lib/types";

export default {
  name: "GenderInput",
  props: {
    value: {
      type: Number,
      default: 0,
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
