<template>
  <div class="organizations-list">
    <div class="container">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <h1 class="m-0">
          Organizations
        </h1>
        <el-tooltip
          class="item"
          effect="dark"
          content="Create"
          placement="bottom"
          :visible-arrow="false"
        >
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            size="default"
            @click="$router.push({ name: 'CreateOrganization' })"
            :disabled="!$store.state.user.detailsLoaded"
          ></el-button>
        </el-tooltip>
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
          <el-card class="organization-detail-card" shadow="never">
            <OrganizationDetails :details="details" />
            <el-button
              class="mt-4 block"
              type="primary"
              @click="$router.push({ name: 'OrganizationProfile', params: { address: details.contractAddress } })"
            >
              Organize
            </el-button>
          </el-card>
        </div>
      </div>

      <div v-else>
        There is no organization found which you are involving.
        If you attended as an admin, you have to create your user profile first to see.
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
};
</script>
