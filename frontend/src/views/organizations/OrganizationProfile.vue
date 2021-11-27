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

            <el-tooltip
              class="item"
              effect="dark"
              content="You are the owner of this organization"
              placement="bottom"
              :visible-arrow="false"
            >
              <span
                class="ownership text-primary"
                v-if="$store.state.organization.details.owner === $store.state.selectedAddress"
              ><i class="el-icon-s-flag" /></span>
            </el-tooltip>
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
                        :class="i > 0 ? 'mt-2': ''"
                      >
                        <Clipboard
                          :text="admin"
                          address
                          toggle
                        />
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
