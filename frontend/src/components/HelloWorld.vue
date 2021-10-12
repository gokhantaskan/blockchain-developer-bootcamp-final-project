<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>

  <div v-if="ethereum">
    <button
      :disabled="!!ethereum.accounts[0]"
      @click="ethereum.requestAccounts"
    >{{ ethereum.accounts.length ? "Connected to Metamask" : "Connect to Metamask" }}</button>

    <div v-if="ethereum.isMetaMask">
      <pre><code>{{ ethereum }}</code></pre>

      <div>
        <button @click="getBalance">Get ETH Balance</button>

        <div>{{ ethBalance }}</div>
      </div>

      <div>
        <label for="#to">
          Address to be sent
          <input id="to" type="text" v-model="address" />
        </label>

        <label for="#amount">
          ETH amount to be sent
          <input id="amount" type="number" v-model="sendAmount" />
        </label>

        <button @click="sendEth">Send ETH</button>

        <pre><code>{{ receipt }}</code></pre>
      </div>
    </div>

    <div v-else>Please install MetaMask extension to continue</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, reactive, ref, withDefaults } from "vue";
import { useEthereum } from "@/composables/ethereum";
import Web3 from "web3";

interface Props {
  msg?: string
}

withDefaults(defineProps<Props>(), {
  msg: "Web3.js",
});

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const { state: ethereum } = useEthereum();

const address = ref("");
const sendAmount = ref(0);
const ethBalance = ref("");
const receipt = ref({});

const getBalance = async () => {
  try {
    web3.eth.getBalance(ethereum.selectedAddress || "", (_error, balance) => {
      ethBalance.value = (web3.utils.fromWei(balance, "ether"));
    });
  } catch (error) {
    alert(error);
  }
};

const sendEth = async () => {
  console.log({
    from: ethereum.accounts[0],
    to: address,
    value: (sendAmount.value) * 10e18,
  });

  try {
    web3.eth.sendTransaction({
      from: ethereum.accounts[0] || undefined,
      to: address.value,
      value: (sendAmount.value) * 10e17,
    })
      .then(tx => {
        receipt.value = tx;
      })
  } catch (error) {
    alert(error);
  }
};
</script>

<style scoped lang="scss">
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
