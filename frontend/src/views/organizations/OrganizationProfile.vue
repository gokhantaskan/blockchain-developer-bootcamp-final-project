<template>
  <div class="organization-profile">
    <div class="container">
      <div class="row" v-if="moduleRegistered">
        <div class="col-12">
          <h1>
            {{ $route.params.address }}
          </h1>
        </div>

        <div class="col-12">
          <pre><code>{{ $store.state.organization.details }}</code></pre>
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
  data() {
    return {
      moduleRegistered: false,
    };
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
