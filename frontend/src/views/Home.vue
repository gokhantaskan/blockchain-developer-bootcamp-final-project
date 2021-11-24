<template>
  <div
    class="home"
    v-loading="loading"
  >
    <div class="container">
      <transition
        name="fade"
        mode="out-in"
      >
        <div v-if="$store.state.user.detailsLoaded">
          <el-card
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
                    content="Update"
                    placement="bottom"
                    :visible-arrow="false"
                  >
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      @click="updateModalVisible = true"
                      :loading="updateModalVisible"
                    ></el-button>
                  </el-tooltip>
                  <el-dialog
                    title="Update User Details"
                    :visible.sync="updateModalVisible"
                  >
                    <UpdateUserForm
                      @updating="_updating"
                      @updated="afterUpdate"
                    />
                    <template
                      slot="footer"
                      class="dialog-footer"
                    >
                      <el-button
                        form="update-user-form"
                        type="primary"
                        native-type="submit"
                        :loading="updating"
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
                      @click="deleteUser"
                      :loading="deleting"
                    ></el-button>
                  </el-tooltip>
                </div>
              </div>
            </template>
            <UserDetails />
          </el-card>

          <div class="mt-4">
            <el-button
              type="primary"
              @click="$router.push({ name: 'CreateOrganization' })"
            >
              Create Organization
            </el-button>
          </div>
        </div>

        <div
          key="2"
          v-else
        >
          <el-button
            type="primary"
            @click="$router.push({ name: 'CreateUser' })"
          >
            Create User
          </el-button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { useEthereum } from "@/composables/ethereum";
import { web3UserContract } from "@/lib/web3";
import { defineComponent } from "vue-demi";
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
      loading: false,
      updateModalVisible: false,
      deleting: false,
      updating: false,
    };
  },
  async beforeMount() {
    const { state: ethereum } = useEthereum();

    this.loading = true;

    // Check if the account is registered before
    web3UserContract.methods
      .isUser(ethereum.selectedAddress)
      .call({ from: ethereum.selectedAddress })
      .then((res: boolean) => {
        if (res) { // If registered, get the details
          this.$store.dispatch("user/setUser", ethereum.selectedAddress);
        } else {
          this.$store.dispatch("user/resetUserState");
        }
      })
      .catch((err: any) => {
        this.$store.dispatch("user/resetUserState");

        Message({
          message: err.message,
          type: "error",
          duration: 0,
          showClose: true,
        });
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    afterUpdate() {
      this.updateModalVisible = false;
      this.$store.dispatch("user/setUser", useEthereum().state.selectedAddress);

      Message({
        message: "Profile updated successfully!",
        type: "success",
        duration: 5000,
      });
    },
    _updating(e: boolean) {
      this.updating = e;
    },
    deleteUser() {
      this.deleting = true;

      this.$confirm(
        `
          <p class='m-0'>This will permanently delete the current user data. Later on, you can create a new profile again.</p>
          <p class="mt-1"><strong>Are you sure?</strong></p>
        `,
        "Attention!",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          customClass: "warning",
          confirmButtonClass: "el-button--warning",
          cancelButtonClass: "is-plain",
          type: "warning",
          dangerouslyUseHTMLString: true,
        }
      )
        .then(async () => {
          await this.$store.dispatch("user/deleteUser", useEthereum().state.selectedAddress);

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
