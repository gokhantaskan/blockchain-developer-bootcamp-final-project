<template>
  <div class="update-organization-form">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        id="update-organization-form"
        @submit.prevent="handleSubmit(updateAdmins)"
        novalidate
      >
        <div class="row">
          <div
            class="col-12 col-md-8 d-flex align-items-start"
            :class="$style.spec"
          >
            <FormItem
              v-model.trim="adminsRef"
              id="admins"
              label="Admins"
              vv-name="Admins"
              :vv-rules="{ regex: /^0x[a-fA-F0-9]{40}$/ }"
            />
            <el-button
              type="primary"
              @click="addAdmin"
            >
              Add
            </el-button>
          </div>

          <div
            class="col-12"
            v-if="admins.length"
          >
            <ul class="ps-4">
              <li
                v-for="(admin, i) in admins"
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
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue-demi";
import { useEthereum } from "@/composables/ethereum";
import { vm } from "@/lib/globals";

export default defineComponent({
  name: "GrantAdminsForm",
  setup(_props, { emit }) {
    const { state: ethereum } = useEthereum();
    const root = vm();

    const adminsRef = ref("");
    const admins = ref<string[]>([]);

    onMounted(() => {
      admins.value = [...vm()?.$store.state.organization.details.admins];
    });

    const addAdmin = () => {
      if (adminsRef.value.toLowerCase() === ethereum.selectedAddress) {
        alert("You are the owner!");
      } else {
        if (
          adminsRef.value.length &&
          ethereum.addressRegex.test(adminsRef.value) &&
          admins.value.indexOf(adminsRef.value) === -1
        ) {
          admins.value.push(adminsRef.value);
          adminsRef.value = "";
        }
      }
    };

    const removeAdmin = (i: number) => {
      admins.value.splice(i, 1);
    };

    const updateAdmins = async () => {
      emit("updating", true);

      await root?.$store.dispatch("organization/updateAdmins", admins.value)
        .then(res => {
          console.log(res);
          emit("updated", true);
        })
        .catch(err => console.log(err));

      emit("updating", false);
    };

    return { admins, adminsRef, addAdmin, removeAdmin, updateAdmins };
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
