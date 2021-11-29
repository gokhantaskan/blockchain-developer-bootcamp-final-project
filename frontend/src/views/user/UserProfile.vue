<template>
  <div class="user-profile">
    <div class="container">
      <div
        v-if="$store.state.isUser"
        class="d-flex align-items-center justify-content-between mb-4"
      >
        <h1>
          Profile
        </h1>

        <div v-if="$store.state.user.detailsLoaded">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="updateModalVisible = true"
            :loading="updateModalVisible"
            v-tippy="{ content: 'Edit' }"
          ></el-button>

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

          <el-button
            type="danger"
            icon="el-icon-delete"
            class="ms-2"
            @click="deleteUser"
            :loading="deleting"
            v-tippy="{ content: 'Delete', placement: 'bottom-end' }"
          ></el-button>
        </div>
      </div>

      <transition
        name="fade"
        mode="out-in"
      >
        <div
          key="1"
          v-if="$store.state.user.detailsLoaded"
        >
          <el-card shadow="never">
            <UserDetails />
          </el-card>
        </div>
        <div
          key="2"
          v-else
        >
          <h1>Hello!</h1>
          <p>To get started, let's create you a profile!</p>
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
import { defineComponent } from "vue-demi";
import { Message } from "element-ui";

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
    this.$store.dispatch("user/setUser");
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
