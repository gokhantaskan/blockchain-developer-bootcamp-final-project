<template>
  <div class="hello">
    <div v-if="ethereum">
      <!-- <OnboardButton /> -->
      <div v-if="ethereum.isMetaMask">
        <pre><code>{{ ethereum }}</code></pre>

        <div class="row">
          <div class="col-6">
            <div class="d-flex">
              <el-button
                type="primary"
                @click="getBalance"
              >
                Get ETH Balance
              </el-button>
              <el-input
                v-model="ethBalance"
                class="ms-2"
                :readonly="true"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        Please install MetaMask extension to continue
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { useEthereum } from "@/composables/ethereum";
import { web3 } from "@/lib/web3";
import { Message } from "element-ui";
// import OnboardButton from "./OnboardButton.vue";

export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: {
      type: String,
      default: "",
    },
  },
  setup() {
    const { state: ethereum } = useEthereum();

    const ethBalance = ref("");

    const getBalance = async () => {
      try {
        web3.eth.getBalance(ethereum.accounts[0] || ethereum.selectedAddress || "", (_error, balance) => {
          ethBalance.value = (web3.utils.fromWei(balance, "ether"));
        });
      } catch (error: any) {
        Message({
          type: "error",
          message: error.message,
          duration: 5000,
        });
      }
    };

    return { ethereum, ethBalance, getBalance };
  },
});
</script>
