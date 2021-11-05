<template>
  <div class="form-item">
    <label class="form-item__label">Gender</label>
    <el-radio-group
      :value="Number(value)"
      @input="handleChange"
      class="d-block"
    >
      <el-radio-button :label="Number(Gender.Male)">
        Male
      </el-radio-button>
      <el-radio-button :label="Number(Gender.Female)">
        Female
      </el-radio-button>
      <el-radio-button :label="Number(Gender.Transgender)">
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
      type: [Number, String],
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
