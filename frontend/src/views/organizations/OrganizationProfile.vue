<template>
  <div class="organization-profile">
    <div class="container">
      <div class="row">
        <div class="col-12">
          {{ $route.params.address }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "OrganizationProfile",
});
</script>
