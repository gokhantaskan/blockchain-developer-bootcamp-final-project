<template>
  <div class="user-details">
    <div class="row">
      <div class="col-12 col-lg-9">
        <div class="table-responsive">
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
                <td>
                  <Clipboard
                    :text="$store.state.user.details.nationalId"
                    toggle
                  />
                </td>
              </tr>
              <tr>
                <th>Gender</th>
                <td>{{ convertGender($store.state.user.details.gender) }}</td>
              </tr>
              <tr>
                <th>E-mail</th>
                <td>
                  <Clipboard
                    :text="$store.state.user.details.email"
                    email
                    toggle
                  />
                </td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{{ $store.state.user.details.phone }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        class="col-12 col-lg-3 mt-4 mt-lg-0 d-flex flex-column align-items-center align-items-lg-end justify-content-center"
      >
        <div
          class="qr-code"
          ref="qrCodeRef"
        ></div>
        <Clipboard
          class="justify-content-center"
          style="line-height: 48px; width: 194px;"
          :text="ethereum.selectedAddress"
          address
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useEthereum } from "@/composables/ethereum";
import { convertGender } from "@/helpers/utils";
import { computed, defineComponent } from "vue-demi";

export default defineComponent({
  name: "UserDetails",
  components: {
    Clipboard: () => import("@/components/Clipboard.vue"),
  },
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
    // const selectedAddress = computed(() => ethereum.selectedAddress);

    return { ethereum, convertGender };
  },
});
</script>
