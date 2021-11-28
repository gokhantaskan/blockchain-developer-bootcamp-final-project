<template>
  <div class="create-user-form">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        @submit.prevent="handleSubmit(createOrganization)"
        novalidate
      >
        <div class="row">
          <div class="col-12 col-md-6">
            <FormItem
              v-model="form.name"
              id="name"
              label="Name"
              vv-name="Name"
              vv-rules="required|min:2"
              message="At least 2 characters"
              required
            />
          </div>

          <div class="col-12 col-md-6">
            <FormItem
              v-model="form.registrationId"
              id="registrationId"
              label="Registration ID"
              vv-name="Registration ID"
              vv-rules="required"
              show-password
              required
            />
          </div>

          <div class="col-12 col-md-6">
            <FormItem
              v-model="form.email"
              id="email"
              label="E-mail"
              vv-name="E-mail"
              vv-rules="email|required"
              required
            />
          </div>

          <div class="col-12 col-md-6">
            <FormItem
              v-model="form.phone"
              id="phone"
              label="Phone"
              vv-name="Phone"
              vv-rules="required"
              required
            />
          </div>

          <div
            class="col-12 col-md-6 d-flex align-items-start"
            :class="$style.spec"
          >
            <FormItem
              v-model.trim="adminsRef"
              id="admins"
              label="Admins"
              vv-name="Admins"
              :vv-rules="{ regex: /^0x[a-fA-F0-9]{40}$/ }"
            />
            <el-button @click="addAdmin">
              Add
            </el-button>
          </div>

          <div
            class="col-12"
            v-if="form.admins.length"
          >
            <ul class="ps-4">
              <li
                v-for="(admin, i) in form.admins"
                :key="i"
              >
                <div class="d-flex align-items-center py-2">
                  <span
                    class="d-inline-block"
                    style="line-height: 24px"
                  >
                    {{ admin }}
                  </span>

                  <span
                    class="pop-button d-inline-flex align-items-center justify-content-center cursor-pointer ms-2"
                    tabindex="0"
                    @click="removeAdmin(i)"
                  >
                    <i class="el-icon-close"></i>
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <div class="col-12 pt-3">
            <el-button
              type="primary"
              native-type="submit"
              :loading="loading"
            >
              Submit
            </el-button>
          </div>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue-demi";
import { useEthereum } from "@/composables/ethereum";
import { Message, Notification } from "element-ui";
import { web3UserContract } from "@/lib/web3";
import { vm } from "@/lib/globals";

export default defineComponent({
  name: "CreateOrganizationForm",
  setup(_props, { emit }) {
    const { state: ethereum } = useEthereum();
    const root = vm();

    const loading = ref(false);
    const adminsRef = ref("");

    const form = reactive({
      name: "",
      registrationId: "",
      email: "",
      phone: "",
      admins: [] as string[],
    });

    const addAdmin = () => {
      if (adminsRef.value.toLowerCase() === ethereum.selectedAddress) {
        alert("You will be the owner of this organization and cannot be an admin!");
      } else {
        if (
          adminsRef.value.length &&
          ethereum.addressRegex.test(adminsRef.value) &&
          form.admins.indexOf(adminsRef.value) === -1
        ) {
          form.admins.push(adminsRef.value);
          adminsRef.value = "";
        }
      }
    };

    const removeAdmin = (i: number) => {
      form.admins.splice(i, 1);
    };

    const createOrganization = async () => {
      loading.value = true;

      await root?.$store.dispatch("user/createOrganization", { ...form })
        .then(res => {
          console.log(res);
          emit("created", true);
        })
        .catch(err => console.log(err));

      loading.value = false;
    };

    return { form, loading, createOrganization, adminsRef, addAdmin, removeAdmin };
  },
});
</script>

<style lang="scss" module>
.spec {
  span {
    width: 100%;
  }

  input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    padding-left: 1rem;
    padding-right: 1rem;
    margin-top: 32px;
  }
}
</style>
