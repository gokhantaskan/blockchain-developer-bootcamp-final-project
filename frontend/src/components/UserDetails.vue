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
        <div style="line-height: 34px">
          {{ selectedAddress.slice(0, 6) + "..." + selectedAddress.slice(-4) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useEthereum } from "@/composables/ethereum";

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
      width: 200,
      height: 200,
    });
  },
  setup() {
    const { state: ethereum } = useEthereum();
    const selectedAddress = ethereum.selectedAddress;

    return { selectedAddress };
  },
};
</script>
