<template>
  <div class="send-eth-form">
    <el-card size="huge">
      <template #header>
        Send ETH
      </template>

      <el-form
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="Address">
          <el-input
            id="to"
            v-model="address"
            type="text"
          />
        </el-form-item>

        <el-form-item label="Amount">
          <el-input-number
            id="amount"
            v-model="sendAmount"
          />
        </el-form-item>

        <el-form-item label="">
          <el-button
            type="primary"
            :disabled="!address.length"
            @click="sendEth"
          >
            Send ETH
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <pre><code>{{ receipt }}</code></pre>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue-demi";
import { useEthereum } from "@/composables/ethereum";
import { web3 } from "@/lib/web3";
import { Message } from "element-ui";

export default defineComponent({
  name: "SendEthButton",
  setup() {
    const { state: ethereum } = useEthereum();

    const address = ref("");
    const sendAmount = ref(0);
    const receipt = ref({});

    const sendEth = async () => {
      try {
        web3.eth.sendTransaction({
          from: ethereum.accounts[0] || ethereum.selectedAddress || undefined,
          to: address.value,
          value: (sendAmount.value) * 10e17,
        })
          .then(tx => {
            receipt.value = tx;
          });
      } catch (error: any) {
        Message({
          type: "error",
          message: error.message,
          duration: 0,
        });
      }
    };

    return { address, sendAmount, receipt, sendEth };
  },
});

</script>
