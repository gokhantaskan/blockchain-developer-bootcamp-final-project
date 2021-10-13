<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <div v-if="ethereum">
      <el-button
        :disabled="!!ethereum.accounts[0]"
        @click="ethereum.requestAccounts"
      >
        {{ ethereum.accounts.length ? "Connected to Metamask" : "Connect to Metamask" }}
      </el-button>
      <!-- <OnboardButton /> -->

      <div v-if="ethereum.isMetaMask">
        <pre><code>{{ ethereum }}</code></pre>

        <div>
          <el-button
            type="primary"
            @click="getBalance"
          >
            Get ETH Balance
          </el-button>

          <el-input
            class="inline ml-4px"
            :readonly="true"
            :model-value="ethBalance"
          />
        </div>

        <el-form
          class="padded"
          label-width="100px"
          label-position="left"
        >
          <el-form-item label="Address">
            <el-input
              id="to"
              v-model="address"
              type="text"
            />
          </el-form-item>

          <el-form-item label="Amount">
            <el-input
              id="amount"
              v-model.number="sendAmount"
              type="number"
            />
          </el-form-item>

          <el-form-item label=" ">
            <el-button
              type="primary"
              :disabled="!address.length"
              @click="sendEth"
            >
              Send ETH
            </el-button>
          </el-form-item>
        </el-form>

        <pre><code>{{ receipt }}</code></pre>
      </div>

      <div v-else>
        Please install MetaMask extension to continue
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, withDefaults, defineProps } from "vue";
import { useEthereum } from "@/composables/ethereum";
import { ElMessage } from "element-plus";
import { web3 } from "@/lib/web3";
// import OnboardButton from "./OnboardButton.vue";

interface Props {
  msg?: string
}

withDefaults(defineProps<Props>(), {
  msg: "Web3.js",
});

const { state: ethereum } = useEthereum();

const address = ref("");
const sendAmount = ref(0);
const ethBalance = ref("");
const receipt = ref({});

const getBalance = async () => {
  try {
    web3.eth.getBalance(ethereum.accounts[0] || ethereum.selectedAddress || "", (_error, balance) => {
      ethBalance.value = (web3.utils.fromWei(balance, "ether"));
    });
  } catch (error: any) {
    ElMessage({
      showClose: true,
      message: error,
      type: "error",
      duration: 5000,
    });
  }
};

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
    ElMessage({
      showClose: true,
      message: error,
      type: "error",
      duration: 5000,
    });
  }
};
</script>

<style scoped lang="scss">
.hello {
  max-width: 960px;
  margin: auto;
}

h3 {
  margin: 40px 0 0;
}

div:nth-child(2) {
  margin-top: 1rem;
}

label {
  display: block;
}
</style>
