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
                v-if="$store.state.organization.details.owner === $store.state.selectedAddress"
                v-tippy="{
                  placement: 'right',
                  content: 'You are the owner of this organization',
                }"
              >
                <i class="el-icon-s-flag" />
              </span>
            </h1>

            <div>
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
          <strong>Contract Address:</strong>
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
                      <ul class="m-0 ps-2">
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
                              class="icon-button"
                              type="danger"
                              size="small"
                              plain
                              icon="el-icon-close"
                              @click="revokeAdmin(admin)"
                              :loading="deletingAdmin"
                            ></el-button>
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

        <div class="col-12 mt-4">
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
            <GrantAdminsForm />
            <template
              slot="footer"
              class="dialog-footer"
            >
              <el-button
                form="grant-admins-form"
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
      grantAdminsModalVisible: false,
      deletingAdmin: false,
    };
  },

  computed: {
    isOwner(): boolean {
      return this.$store.state.organization.details.owner === this.$store.state.selectedAddress;
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
    _updating(e: boolean) {
      this.updating = e;
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
