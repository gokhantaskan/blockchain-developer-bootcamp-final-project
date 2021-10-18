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
        class="col-12 col-lg-3 mt-4 mt-lg-0 d-flex flex-column align-items-center justify-content-center justify-content-lg-end"
      >
        <div
          class="qr-code"
          ref="qrCodeRef"
        ></div>
        <div
          class="d-flex align-items-center"
          style="line-height: 40px"
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

<script>
import { useEthereum } from "@/composables/ethereum";
import { useClipboard } from "@vueuse/core";
import { Message } from "element-ui";
import { watch } from "vue-demi";

export default {
  name: "UserDetails",
  data() {
    return {
      qrCode: null,
      editModalVisible: false,
    };
  },
  mounted() {
    const QRCode = window.QRCode;

    this.qrCode = new QRCode(this.$refs.qrCodeRef, {
      text: useEthereum().state.selectedAddress,
      width: 194,
      height: 194,
    });
  },
  setup() {
    const { state: ethereum } = useEthereum();
    const { copy, copied } = useClipboard();
    const selectedAddress = ethereum.selectedAddress;

    watch(copied, newVal => {
      if (newVal) {
        Message.success({
          message: "Address copied to the clipboard!",
        });
      }
    });

    return { selectedAddress, copy, copied };
  },
};
</script>

<style module lang="scss">
.button {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-left: 0.25rem;
}
</style>
