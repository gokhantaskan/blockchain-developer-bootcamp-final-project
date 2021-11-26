<template>
  <div class="organization-details">
    <div class="row">
      <div class="col-12">
        <div class="table--responsive">
          <table class="table table--details">
            <tbody>
              <tr>
                <th>Name</th>
                <td>{{ details.name }}</td>
              </tr>
              <tr>
                <th>Registration ID</th>
                <td>
                  <Clipboard
                    :text="details.registrationId"
                    toggle
                  />
                </td>
              </tr>
              <tr>
                <th>E-mail</th>
                <td>{{ details.email }}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{{ details.phone }}</td>
              </tr>
              <tr>
                <th>Admins</th>
                <td>
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
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
