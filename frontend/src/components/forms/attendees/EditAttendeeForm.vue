<template>
  <div class="edit-attendee-form">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        id="edit-attendee-form"
        @submit.prevent="handleSubmit(updateAttendee)"
        novalidate
      >
        <div class="row">
          <div class="col-12 col-lg-6">
            <FormItem
              v-model="form.firstName"
              id="firstName"
              label="First Name"
              vv-name="First Name"
              vv-rules="required|min:2|alpha_spaces"
              message="At least 2 characters"
              required
            />
          </div>

          <div class="col-12 col-lg-6">
            <FormItem
              v-model="form.lastName"
              id="lastName"
              label="Last Name"
              vv-name="Last Name"
              vv-rules="required|min:2|alpha"
              message="At least 2 characters"
              required
            />
          </div>

          <div class="col-12 col-lg-6">
            <FormItem
              v-model="form.nationalId"
              id="nationalId"
              label="National ID"
              vv-name="National ID"
              vv-rules="required"
              required
            />
          </div>

          <div class="col-12 col-lg-6">
            <FormItem
              v-model="form.email"
              id="email"
              label="E-mail"
              vv-name="E-mail"
              vv-rules="email"
            />
          </div>

          <div class="col-12 col-lg-6">
            <FormItem
              v-model="form.phone"
              id="phone"
              label="Phone"
              vv-name="Phone"
            />
          </div>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "@vue/composition-api";
import { useEthereum } from "@/composables/ethereum";
import { Message } from "element-ui";
import { attendeeContract } from "@/contracts";
import { vm } from "@/lib/globals";

export default defineComponent({
  name: "updateAttendeeForm",
  setup(_props, { emit }) {
    const { state: ethereum } = useEthereum();
    const transaction = ref({});
    const form = reactive({
      firstName: "",
      lastName: "",
      nationalId: "",
      email: "",
      phone: "",
    });

    const updateAttendee = () => {
      attendeeContract.methods
        .updateAttendeeDetails(form.firstName, form.lastName, form.nationalId, form.email, form.phone)
        .send({ from: ethereum.selectedAddress })
        .then((res: any) => {
          transaction.value = res;
          emit("updated", true);
        })
        .catch((error: any) => {
          Message({
            type: "error",
            message: error.message,
            duration: 5000,
          });

          console.log(error.message);
        });
    };

    onMounted(() => {
      const attendeeDetails = vm().root.proxy.$store.state.attendee.details;

      form.firstName = attendeeDetails.firstName;
      form.lastName = attendeeDetails.lastName;
      form.nationalId = attendeeDetails.nationalId;
      form.email = attendeeDetails.email;
      form.phone = attendeeDetails.phone;
    });

    return { form, updateAttendee };
  },
});
</script>
