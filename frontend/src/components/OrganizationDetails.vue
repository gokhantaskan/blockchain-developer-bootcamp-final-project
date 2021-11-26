<template>
  <div class="organization-details">
    <div class="row">
      <div class="col-12">
        <h2 class="m-0 mb-2">
          {{ details.name }}
        </h2>

        <p class="m-0 mb-4">
          <strong>Registration ID: </strong>
          <Clipboard
            :text="details.registrationId"
            toggle
          />
        </p>

        <p class="m-0 mb-2">
          <strong>E-mail: </strong>
          {{ details.email }}
        </p>

        <p class="m-0 mb-2">
          <strong>Phone: </strong>
          {{ details.phone }}
        </p>

        <p class="m-0">
          <strong>Member count: </strong>
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
