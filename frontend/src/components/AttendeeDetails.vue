<template>
  <div class="attendee-details">
    <el-card>
      <template #header>
        Attendee Details
      </template>

      <div class="row">
        <div class="col-12 col-md-9">
          <table class="table table--details">
            <tbody>
              <tr>
                <th>First Name</th>
                <td>{{ $store.state.attendee.details.firstName }}</td>
              </tr>
              <tr>
                <th>Last Name</th>
                <td>{{ $store.state.attendee.details.lastName }}</td>
              </tr>
              <tr>
                <th>National ID</th>
                <td>{{ $store.state.attendee.details.nationalId }}</td>
              </tr>
              <tr>
                <th>E-mail</th>
                <td>{{ $store.state.attendee.details.email }}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{{ $store.state.attendee.details.phone }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="col-12 col-md-3 mt-4 mt-md-0 d-flex align-items-center justify-content-center justify-content-xl-end">
          <div class="qr-code" ref="qrCodeRef"></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { useEthereum } from '@/composables/ethereum';
export default {
  name: "AttendeeDetails",
  data() {
    return {
      qrCode: null,
    };
  },
  mounted() {
    const QRCode = window.QRCode;

    this.qrCode = new QRCode(this.$refs.qrCodeRef, {
      text: useEthereum().state.selectedAddress,
      width: 160,
      height: 160,
    });
  },
};
</script>
