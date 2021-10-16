import Vue from "vue";
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";

import * as rules from "vee-validate/dist/rules";
import { messages } from "vee-validate/dist/locale/en.json";

Object.keys(rules).forEach(rule => {
  extend(rule, {
    ...rules[rule], // copies rule configuration
    message: messages[rule],
  });
});

// Add a rule.
extend("latitude", {
  validate: value => {
    return /^(\+|-)?(?:90(?:(?:\.0{1,15})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,15})?))$/.test(value) === true;
  },
  message: "Regex not fit",
  // message: "{_field_} must be a valid latitude value",
});

// Register it globally
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);
