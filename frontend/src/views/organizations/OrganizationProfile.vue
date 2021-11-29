<template>
  <div class="organization-profile">
    <div class="container">
      <div
        class="row"
        v-if="moduleRegistered"
      >
        <div class="col-12">
          <div class="d-flex align-items-center justify-content-between mb-4">
            <h1>
              {{ $store.state.organization.details.name }}

              <span
                tabindex="0"
                class="text-primary"
                v-if="isOwner"
                v-tippy="{
                  placement: 'right',
                  content: 'You are the owner of this organization',
                }"
              >
                <i class="el-icon-s-flag" />
              </span>
              <span
                tabindex="0"
                class="text-primary"
                v-if="isAdmin"
                v-tippy="{
                  placement: 'right',
                  content: 'You are the admin of this organization',
                }"
              >
                <i class="el-icon-user-solid" />
              </span>
            </h1>

            <div v-if="isOwner || isAdmin">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="updateModalVisible = true"
                v-tippy="{ content: 'Edit' }"
              ></el-button>

              <el-dialog
                title="Update Organization Details"
                :visible.sync="updateModalVisible"
              >
                <UpdateOrganizationForm
                  @updating="_updating"
                  @updated="afterUpdate"
                />
                <template
                  slot="footer"
                  class="dialog-footer"
                >
                  <el-button
                    form="update-organization-form"
                    type="primary"
                    native-type="submit"
                    :loading="updating"
                  >
                    Confirm
                  </el-button>
                </template>
              </el-dialog>
            </div>
          </div>
        </div>

        <div class="col-12">
          <strong>Contract Address: </strong>
          <Clipboard
            :text="$store.state.organization.contractAddress"
            toggle
            address
          />
        </div>

        <div class="col-12 mt-4">
          <el-card shadow="never">
            <div class="table--responsive">
              <table class="table table--details">
                <tbody>
                  <tr>
                    <th>Registration ID</th>
                    <td>{{ $store.state.organization.details.registrationId }}</td>
                  </tr>
                  <tr>
                    <th>E-mail</th>
                    <td>{{ $store.state.organization.details.email }}</td>
                  </tr>
                  <tr>
                    <th>Phone</th>
                    <td>{{ $store.state.organization.details.phone }}</td>
                  </tr>
                  <tr v-if="!isOwner">
                    <th>Owner</th>
                    <td>
                      <Clipboard
                        :text="$store.state.organization.details.owner"
                        address
                        toggle
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>Admins</th>
                    <td>
                      <ul class="m-0 ps-4">
                        <li
                          v-for="(admin, i) in $store.state.organization.details.admins"
                          :key="i"
                          :class="[i > 0 ? 'mt-2' : '']"
                        >
                          <div class="d-flex align-items-center">
                            <Clipboard
                              :text="admin"
                              address
                              toggle
                            />
                            <el-button
                              v-if="isOwner"
                              class="icon-button"
                              type="danger"
                              size="small"
                              plain
                              icon="el-icon-close"
                              @click="revokeAdmin(admin)"
                              :loading="deletingAdmin"
                              :disabled="deletingAdmin"
                            ></el-button>
                            <span class="d-inline-block ms-3 fs-sm fw-bold text-primary">
                              {{ admin === $store.state.selectedAddress ? "(This is you)" : undefined }}
                            </span>
                          </div>
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </el-card>
        </div>

        <div
          class="col-12 mt-4"
          v-if="isOwner"
        >
          <el-button
            type="primary"
            @click="grantAdminsModalVisible = true"
            :loading="grantAdminsModalVisible"
          >
            Grant Admins
          </el-button>
          <el-dialog
            title="Add New Admin(s)"
            :visible.sync="grantAdminsModalVisible"
          >
            <GrantAdminsForm
              @granting="_granting"
              @updated="afterGrant"
            />
            <template
              slot="footer"
              class="dialog-footer"
            >
              <el-button
                form="grant-admins-form"
                type="primary"
                native-type="submit"
                :loading="granting"
              >
                Confirm
              </el-button>
            </template>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import { organizationModule } from "@/store/modules/organization";
import UpdateOrganizationForm from "@/components/forms/organizations/UpdateOrganizationForm.vue";
import { Message } from "element-ui";
import GrantAdminsForm from "@/components/forms/organizations/GrantAdminsForm.vue";

export default defineComponent({
  name: "OrganizationProfile",
  components: {
    Clipboard: () => import("@/components/Clipboard.vue"),
    UpdateOrganizationForm,
    GrantAdminsForm,
  },

  data() {
    return {
      moduleRegistered: false,
      updating: false,
      updateModalVisible: false,
      granting: false,
      grantAdminsModalVisible: false,
      deletingAdmin: false,
    };
  },

  computed: {
    isOwner(): boolean {
      return this.$store.state.organization.details.owner === this.$store.state.selectedAddress;
    },
    isAdmin(): boolean {
      return this.$store.state.organization.details.admins.includes(this.$store.state.selectedAddress);
    },
  },

  mounted() {
    this.$store.dispatch("organization/setOrganization");
  },

  methods: {
    afterUpdate() {
      this.updateModalVisible = false;

      Message({
        message: "Organization updated successfully!",
        type: "success",
        duration: 5000,
      });
    },
    afterGrant() {
      this.grantAdminsModalVisible = false;

      Message({
        message: "Admin(s) added successfully!",
        type: "success",
        duration: 5000,
      });
    },
    _updating(e: boolean) {
      this.updating = e;
    },
    _granting(e: boolean) {
      this.granting = e;
    },
    async revokeAdmin(address: string) {
      this.deletingAdmin = true;

      await this.$store.dispatch("organization/revokeAdmin", address)
        .then(res => { console.log(res) })
        .catch(err => { console.log(err) });

      this.deletingAdmin = false;
    },
  },

  beforeRouteEnter(_to, _from, next) {
    next(vm => {
      if (!vm.$store.hasModule("organization")) {
        vm.$store.registerModule("organization", organizationModule);
        vm.$data.moduleRegistered = true;
        vm.$store.dispatch("organization/setContractAddress", vm.$route.params.address);
      }
    });
  },
  beforeRouteLeave(_to, _from, next) {
    if (this.$store.hasModule("organization")) {
      this.$store.unregisterModule("organization");
      this.moduleRegistered = false;
    }

    next();
  },
});
</script>
