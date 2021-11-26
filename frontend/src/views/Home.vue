<template>
  <div class="home">
    <div class="container">
      <el-tabs>
        <el-tab-pane label="Profile">
          <transition
            name="fade"
            mode="out-in"
          >
            <div
              key="1"
              v-if="$store.state.user.detailsLoaded"
            >
              <div class="d-flex align-items-center justify-content-between mb-4">
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
                Create User
              </el-button>
            </div>
          </transition>
        </el-tab-pane>

        <el-tab-pane label="Organizations">
          <el-button
            type="primary"
            @click="$router.push({ name: 'CreateOrganization' })"
          >
            Create Organization
          </el-button>

          <div class="mt-4">
            <pre><code>{{ $store.state.user.organizations }}</code></pre>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
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
      updateModalVisible: false,
      deleting: false,
      updating: false,
    };
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
        .then(async res => {
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
        .catch(() => {})
        .finally(() => {
          this.deleting = false;
        });
    },
  },
});
</script>
