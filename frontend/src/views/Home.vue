<template>
  <div class="home">
    <div
      class="container"
      v-loading="loading"
    >
      <PageHeader title="Home" />
      <HelloWorld />

      <template v-if="$store.state.attendee.detailsLoaded">
        <AttendeeDetails class="mt-4" />
      </template>
      <template v-else>
        <CreateAttendeeForm class="mt-4" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { useEthereum } from "@/composables/ethereum";
import { attendeeContract } from "@/contracts";
import { defineComponent } from "@vue/composition-api";
import { Message } from "element-ui";

export default defineComponent({
  name: "Home",
  components: {
    PageHeader: () => import("@/components/PageHeader.vue"),
    HelloWorld: () => import("@/components/HelloWorld.vue"),
    AttendeeDetails: () => import("@/components/AttendeeDetails.vue"),
    CreateAttendeeForm: () => import("@/components/forms/attendees/CreateAttendeeForm.vue"),
  },
  data() {
    return {
      loading: false,
    };
  },
  async mounted() {
    const { state: ethereum } = useEthereum();

    this.$watch(
      () => ethereum.selectedAddress,
      async (newVal, oldVal) => {
        if (newVal !== oldVal) {
          this.loading = true;

          // Check if the account is registered before
          attendeeContract.methods.isAttendee(newVal).call()
            .then((res: boolean) => {
              if (res) { // If registered, get the details
                this.$store.dispatch("attendee/getAttendeeDetails", newVal);
              } else { // Else, clear the previous details
                this.$store.dispatch("attendee/resetAttendeeState");
              }
            })
            .catch((err: any) => {
              this.$store.dispatch("attendee/resetAttendeeState");

              Message({
                message: err.message,
                type: "error",
                duration: 5000,
              });
            })
            .finally(() => { this.loading = false });
        }
      }
    );
  },
});
</script>
