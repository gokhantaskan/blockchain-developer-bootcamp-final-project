<template>
  <div class="attendee-details">
    <el-card shadow="never">
      <template #header>
        <div class="d-flex align-items-center justify-content-between">
          <h2 class="m-0">
            Attendee Details
          </h2>

          <div>
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="editModalVisible = true"
            >
            </el-button>
            <el-dialog
              title="Edit Attendee Details"
              :visible.sync="editModalVisible"
              destroy-on-close
            >
              <EditAttendeeForm @updated="afterUpdate" />
              <template
                slot="footer"
                class="dialog-footer"
              >
                <el-button
                  form="edit-attendee-form"
                  type="primary"
                  native-type="submit"
                >
                  Confirm
                </el-button>
              </template>
            </el-dialog>

            <el-button
              type="danger"
              icon="el-icon-delete"
              class="ms-2"
              @click="removeAttendee"
            >
            </el-button>
          </div>
        </div>
      </template>

      <div class="row">
        <div class="col-12 col-lg-9">
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

        <div class="col-12 col-lg-3 mt-4 mt-lg-0 d-flex align-items-center justify-content-center justify-content-lg-end">
          <div
            class="qr-code"
            ref="qrCodeRef"
          ></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { useEthereum } from "@/composables/ethereum";

export default {
  name: "AttendeeDetails",
  components: {
    EditAttendeeForm: () => import("@/components/forms/attendees/EditAttendeeForm.vue"),
  },
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
      width: 214,
      height: 214,
    });
  },
  methods: {
    afterUpdate(e) {
      this.editModalVisible = false;
      this.$store.dispatch("attendee/getAttendeeDetails", useEthereum().state.selectedAddress);
    },
    removeAttendee() {
      this.$confirm(
        "This will permanently delete the user. Later, you can create your profile again. Continue?",
        "Attention!",
        {
          confirmButtonText: "Delete Permanently",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(async () => {
          await this.$store.dispatch("attendee/removeAttendee", useEthereum().state.selectedAddress);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Delete canceled",
          });
        });
    },
  },
};
</script>
