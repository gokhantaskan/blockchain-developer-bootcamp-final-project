<template>
  <div class="user-profile">
    <div class="container">
      <transition
        name="fade"
        mode="out-in"
      >
        <div
          key="1"
          v-if="$store.state.user.detailsLoaded"
        >
          <div class="d-flex align-items-center justify-content-between mb-4">
            <h1 class="m-0">
              Profile
            </h1>
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
          <el-card shadow="never">
            <UserDetails />
          </el-card>
        </div>
        <div
          key="2"
          v-else
        >
          <el-button
            type="primary"
            @click="$router.push({ name: 'CreateUser' })"
          >
            Create User Profile
          </el-button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Message } from "element-ui";
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "UserProfile",
  components: {
    UserDetails: () => import("@/components/UserDetails.vue"),
    OrganizationDetails: () => import("@/components/OrganizationDetails.vue"),
    CreateUserForm: () => import("@/components/forms/users/CreateUserForm.vue"),
    UpdateUserForm: () => import("@/components/forms/users/UpdateUserForm.vue"),
  },
  data() {
    return {
      updateModalVisible: false,
      deleting: false,
      updating: false,
    };
  },
  mounted() {
    console.log("owned", this.$store.getters["user/ownedOrganizations"]);
    console.log("attended", this.$store.getters["user/attendedOrganizations"]);
  },
  methods: {
    afterUpdate() {
      this.updateModalVisible = false;

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
          await this.$store.dispatch("user/deleteUser")
            .then(() => {
              Message({
                message: "Profile deleted successfully!",
                type: "success",
                duration: 5000,
              });
            })
            .catch(err => console.log(err));
        })
        .catch(() => { })
        .finally(() => {
          this.deleting = false;
        });
    },
  },
});
</script>
