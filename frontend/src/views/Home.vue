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
                    content="Edit"
                    placement="bottom"
                    :visible-arrow="false"
                  >
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      @click="editModalVisible = true"
                      :loading="editModalVisible"
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
      editModalVisible: false,
      deleting: false,
      editing: false,
    };
  },
  async beforeMount() {
    const { state: ethereum } = useEthereum();

    this.$watch(
      () => ethereum.selectedAddress,
      async newVal => {
        if (newVal) {
          this.loading = true;

          // Check if the account is registered before
          web3UserContract.methods
            .isUser(newVal)
            .call({ from: newVal })
            .then((res: boolean) => {
              if (res) { // If registered, get the details
                this.$store.dispatch("user/getUserDetails", newVal);
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
        }
      },
      {
        immediate: true,
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
    updating(e: boolean) {
      this.editing = e;
    },
    removeUser() {
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
          type: "warning",
          dangerouslyUseHTMLString: true,
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
