<template>
  <div class="organization-profile">
    <div class="container">
      <div
        class="row"
        v-if="moduleRegistered"
      >
        <div class="col-12">
          <h1 class="mt-0">
            {{ $store.state.organization.details.name }}

            <button
              class="text-primary"
              v-if="$store.state.organization.details.owner === $store.state.selectedAddress"
              v-tippy="{
                placement : 'right',
                content: 'You are the owner of this organization',
              }"
            >
              <i class="el-icon-s-flag" />
            </button>
          </h1>
          <div class="m-0">
            <strong>Contract Address: </strong><Clipboard
              :text="$store.state.organization.contractAddress"
              toggle
              address
            />
          </div>
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
                    <td>
                      {{ $store.state.organization.details.email }}
                    </td>
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
                          :class="[i > 0 ? 'mt-2': '']"
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
          <el-button type="primary">
            Grant Admins
          </el-button>

          <el-button type="warning">
            Revoke Admins
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import { organizationModule } from "@/store/modules/organization";

export default defineComponent({
  name: "OrganizationProfile",
  components: {
    Clipboard: () => import("@/components/Clipboard.vue"),
  },
  data() {
    return {
      moduleRegistered: false,
    };
  },
  computed: {
    isOwner() {
      return this.$store.state.organization.details.owner === this.$store.state.selectedAddress;
    },
  },
  mounted() {
    this.$store.dispatch("organization/setOrganization");
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
