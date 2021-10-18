<template>
  <div
    class="home"
    v-loading="loading"
  >
    <div class="container">
      <PageHeader title="Sertifie.me" />

      <transition
        name="fade"
        mode="out-in"
      >
        <el-card
          v-if="$store.state.user.detailsLoaded"
          key="1"
          shadow="never"
        >
          <template #header>
            <div class="d-flex align-items-center justify-content-between">
              <h2 class="m-0">
                User Details
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
                  title="Edit User Details"
                  :visible.sync="editModalVisible"
                >
                  <UpdateUserForm
                    @updating="updating"
                    @updated="afterUpdate"
                  />
                  <template
                    slot="footer"
                    class="dialog-footer"
                  >
                    <el-button
                      form="edit-user-form"
                      type="primary"
                      native-type="submit"
                      :loading="editing"
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
                    @click="removeUser"
                    :loading="deleting"
                  ></el-button>
                </el-tooltip>
              </div>
            </div>
          </template>
          <UserDetails />
        </el-card>

        <el-card
          v-else
          key="2"
          shadow="never"
        >
          <template #header>
            <h2 class="m-0">
              Create User Profile
            </h2>
          </template>
          <CreateUserForm @created="afterCreate" />
        </el-card>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { useEthereum } from "@/composables/ethereum";
import { userContract } from "@/contracts";
import { defineComponent } from "@vue/composition-api";
import { Message } from "element-ui";

export default defineComponent({
  name: "Home",
  components: {
    PageHeader: () => import("@/components/PageHeader.vue"),
    UserDetails: () => import("@/components/UserDetails.vue"),
    CreateUserForm: () => import("@/components/forms/users/CreateUserForm.vue"),
    UpdateUserForm: () => import("@/components/forms/users/UpdateUserForm.vue"),
  },
  data() {
    return {
      selectedAddress: "",
      loading: false,
      editModalVisible: false,
      deleting: false,
      editing: false,
    };
  },
  async mounted() {
    const { state: ethereum } = useEthereum();
    if (ethereum.selectedAddress !== null) this.selectedAddress = ethereum.selectedAddress;

    this.$watch(
      () => ethereum.selectedAddress,
      async (newVal, oldVal) => {
        if (newVal !== oldVal) {
          this.loading = true;

          // Check if the account is registered before
          userContract.methods
            .isUser(newVal)
            .call({ from: newVal })
            .then((res: boolean) => {
              if (res) { // If registered, get the details
                this.$store.dispatch("user/getUserDetails", newVal);
              } else { // Else, clear the previous details
                this.$store.dispatch("user/resetUserState");
              }
            })
            .catch((err: any) => {
              this.$store.dispatch("user/resetUserState");

              Message({
                message: err.message,
                type: "error",
                duration: 5000,
              });
            })
            .finally(() => {
              this.loading = false;
            });
        }
      }
    );
  },
  methods: {
    afterUpdate() {
      this.editModalVisible = false;
      this.$store.dispatch("user/getUserDetails", useEthereum().state.selectedAddress);

      Message({
        message: "Profile updated successfully!",
        type: "success",
        duration: 5000,
      });
    },
    afterCreate() {
      this.$store.dispatch("user/getUserDetails", useEthereum().state.selectedAddress);

      Message({
        message: "Profile created successfully!",
        type: "success",
        duration: 5000,
      });
    },
    updating(e: boolean) {
      this.editing = e;
    },
    removeUser() {
      this.deleting = true;

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
          await this.$store.dispatch("user/removeUser", useEthereum().state.selectedAddress);
          // .then(transaction => console.log("tx", transaction));

          Message({
            message: "Profile deleted successfully!",
            type: "success",
            duration: 5000,
          });
        })
        .finally(() => {
          this.deleting = false;
        });
    },
  },
});
</script>
