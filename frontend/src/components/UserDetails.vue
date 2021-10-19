<template>
  <div class="user-details">
    <div class="row">
      <div class="col-12 col-lg-9">
        <table class="table table--details">
          <tbody>
            <tr>
              <th>First Name</th>
              <td>{{ $store.state.user.details.firstName }}</td>
            </tr>
            <tr>
              <th>Last Name</th>
              <td>{{ $store.state.user.details.lastName }}</td>
            </tr>
            <tr>
              <th>National ID</th>
              <td>{{ $store.state.user.details.nationalId }}</td>
            </tr>
            <tr>
              <th>Gender</th>
              <td>{{ convertGender($store.state.user.details.gender) }}</td>
            </tr>
            <tr>
              <th>E-mail</th>
              <td>{{ $store.state.user.details.email }}</td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>{{ $store.state.user.details.phone }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="col-12 col-lg-3 mt-4 mt-lg-0 d-flex flex-column align-items-center align-items-lg-end justify-content-center"
      >
        <div
          class="qr-code"
          ref="qrCodeRef"
        ></div>
        <div
          class="d-flex align-items-center justify-content-center"
          style="line-height: 48px; width: 194px;"
        >
          {{ selectedAddress.slice(0, 6) + "..." + selectedAddress.slice(-4) }}
          <el-tooltip
            class="item"
            effect="dark"
            :content="'Copy'"
            placement="bottom"
            :visible-arrow="false"
          >
            <el-button
              :class="$style.button"
              :disabled="copied"
              @click="copy(selectedAddress)"
              icon="el-icon-copy-document"
              type="info"
              size="small"
              plain
            ></el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useEthereum } from "@/composables/ethereum";
import { convertGender } from "@/helpers/utils";
import { useClipboard } from "@vueuse/core";
import { Message } from "element-ui";
import { defineComponent, watch } from "vue-demi";

export default defineComponent({
  name: "UserDetails",
  data() {
    return {
      qrCode: null,
      editModalVisible: false,
    };
  },
  mounted() {
    const QRCode = (window as any).QRCode;

    this.qrCode = new QRCode(this.$refs.qrCodeRef, {
      text: useEthereum().state.selectedAddress,
      width: 194,
      height: 194,
    });
  },
  setup() {
    const { state: ethereum } = useEthereum();
    const { copy, copied } = useClipboard();
    const selectedAddress = ethereum.selectedAddress || "";

    watch(copied, newVal => {
      if (newVal) {
        Message.success({
          message: "Address copied to the clipboard!",
        });
      }
    });

    return { selectedAddress, copy, copied, convertGender };
  },
});
</script>

<style module lang="scss">
.button {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-left: 0.5rem;
}
</style>
