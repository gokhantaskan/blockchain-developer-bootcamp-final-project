<template>
  <div
    class="home"
    v-loading="loading"
  >
    <div class="container">
      <PageHeader title="Home" />

      <template>
        <el-card
          shadow="never"
          v-if="$store.state.attendee.detailsLoaded"
        >
          <template #header>
            <div class="d-flex align-items-center justify-content-between">
              <h2 class="m-0">
                Attendee Details
              </h2>

              <div>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Edit"
                  placement="bottom"
                  :visible-arrow="false"
                >
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    @click="editModalVisible = true"
                  ></el-button>
                </el-tooltip>
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

                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Delete"
                  placement="bottom"
                  :visible-arrow="false"
                >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    class="ms-2"
                    @click="removeAttendee"
                  ></el-button>
                </el-tooltip>
              </div>
            </div>
          </template>
          <AttendeeDetails />
        </el-card>

        <el-card
          shadow="never"
          v-else
        >
          <template #header>
            <h2 class="m-0">
              Create Attendee Profile
            </h2>
          </template>

          <CreateAttendeeForm @created="afterCreate" />
        </el-card>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { useEthereum } from "@/composables/ethereum";
import { attendeeContract } from "@/contracts";
import { defineComponent } from "@vue/composition-api";
import { Message } from "element-ui";

export default defineComponent({
  name: "Home",
  components: {
    PageHeader: () => import("@/components/PageHeader.vue"),
    AttendeeDetails: () => import("@/components/AttendeeDetails.vue"),
    CreateAttendeeForm: () => import("@/components/forms/attendees/CreateAttendeeForm.vue"),
    EditAttendeeForm: () => import("@/components/forms/attendees/EditAttendeeForm.vue"),
  },
  data() {
    return {
      loading: false,
      editModalVisible: false,
    };
  },
  async mounted() {
    const { state: ethereum } = useEthereum();

    this.$watch(
      () => ethereum.selectedAddress,
      async (newVal, oldVal) => {
        if (newVal !== oldVal) {
          this.loading = true;

          // Check if the account is registered before
          attendeeContract.methods.isAttendee(newVal).call()
            .then((res: boolean) => {
              if (res) { // If registered, get the details
                this.$store.dispatch("attendee/getAttendeeDetails", newVal);
              } else { // Else, clear the previous details
                this.$store.dispatch("attendee/resetAttendeeState");
              }
            })
            .catch((err: any) => {
              this.$store.dispatch("attendee/resetAttendeeState");

              Message({
                message: err.message,
                type: "error",
                duration: 5000,
              });
            })
            .finally(() => { this.loading = false });
        }
      }
    );
  },
  methods: {
    afterUpdate() {
      this.editModalVisible = false;
      this.$store.dispatch("attendee/getAttendeeDetails", useEthereum().state.selectedAddress);

      Message({
        message: "Profile updated successfully!",
        type: "success",
        duration: 5000,
      });
    },
    afterCreate() {
      this.$store.dispatch("attendee/getAttendeeDetails", useEthereum().state.selectedAddress);

      Message({
        message: "Profile created successfully!",
        type: "success",
        duration: 5000,
      });
    },
    removeAttendee() {
      this.$confirm(
        "This will permanently delete the user. Later, you can create your profile again. Continue?",
        "Attention!",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(async () => {
          await this.$store.dispatch("attendee/removeAttendee", useEthereum().state.selectedAddress);

          Message({
            message: "Profile deleted successfully!",
            type: "success",
            duration: 5000,
          });
        });
      // .catch(() => {
      //   this.$message({
      //     type: "info",
      //     message: "Delete canceled",
      //   });
      // });
    },
  },
});
</script>
