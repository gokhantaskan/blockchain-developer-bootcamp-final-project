<template>
  <div class="organization-details">
    <div class="row">
      <div class="col-12">
        <h2 class="m-0 mb-2">
          {{ details.name }}
          <button
            class="text-primary"
            v-if="details.owner === $store.state.selectedAddress"
            v-tippy="{
              placement : 'right',
              content: 'You are the owner of this organization',
              trigger: 'focus mouseenter'
            }"
          >
            <i class="el-icon-s-flag" />
          </button>
        </h2>

        <p class="m-0 mb-4">
          <strong>Registration ID: </strong>
          <Clipboard
            :text="details.registrationId"
            toggle
          />
        </p>

        <p class="m-0 mb-2">
          <i class="el-icon-message"></i>
          {{ details.email }}
        </p>

        <p class="m-0 mb-2">
          <i class="el-icon-mobile-phone"></i>
          {{ details.phone }}
        </p>

        <p class="m-0">
          <i class="el-icon-user"></i>
          {{ details.admins.length }}
        </p>
        <!-- Admins
          <ul class="ps-3 my-0">
            <li
              v-for="(admin, i) in details.admins"
              :key="i"
            >
              <Clipboard
                :text="admin"
                address
                toggle
              />
            </li>
          </ul> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "UserDetails",
  components: {
    Clipboard: () => import("@/components/Clipboard.vue"),
  },
  props: {
    details: {
      type: Object,
      default: () => ({
        name: "",
        registrationId: "",
        email: "",
        phone: "",
        admins: [],
        owner: "",
      }),
      required: true,
    },
  },
  data() {
    return {
      qrCode: null,
    };
  },
  mounted() {
  },
  setup() {
    return {};
  },
});
</script>
