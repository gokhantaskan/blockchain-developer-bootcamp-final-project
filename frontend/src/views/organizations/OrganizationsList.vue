<template>
  <div class="organizations-list">
    <div class="container">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <h1>
          Organizations
        </h1>

        <el-button
          v-if="$store.state.isUser"
          type="primary"
          icon="el-icon-circle-plus-outline"
          size="default"
          @click="$router.push({ name: 'CreateOrganization' })"
          :disabled="!$store.state.user.detailsLoaded"
          v-tippy="{ content: 'Create', placement: 'bottom-end' }"
        ></el-button>
      </div>

      <div
        class="row"
        v-if="$store.state.user.organizations.length"
      >
        <div
          class="col-12 col-lg-6 mb-4"
          v-for="(details, i) in $store.state.user.organizations"
          :key="i"
        >
          <el-card
            class="organization-detail-card"
            shadow="never"
          >
            <OrganizationDetails :details="details" />
            <el-button
              class="mt-4 block"
              type="primary"
              @click="$router.push({ name: 'OrganizationProfile', params: { address: details.contractAddress } })"
            >
              Details
            </el-button>
          </el-card>
        </div>
      </div>

      <div v-else>
        <p class="m-0 mb-2 fs-md">
          There are no organizations found which you are involving.
        </p>
        <p class="m-0" v-if="!$store.state.isUser">
          If you attended as an admin, you have to <router-link :to="{ name: 'CreateUser' }">
            <strong>create your user profile</strong>
          </router-link> first to see.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrganizationsList",
  components: {
    OrganizationDetails: () => import("@/components/OrganizationDetails.vue"),
  },
  mounted() {
    this.$store.dispatch("user/setOrganizations");
  },
};
</script>
