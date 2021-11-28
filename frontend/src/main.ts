import Vue from "vue";
import "./plugins/composition-api";
import "./plugins/element-ui";
import "./plugins/vee-validate";
import "./plugins/vue-tippy";
import "./components/globals";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./assets/styles/main.scss";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
