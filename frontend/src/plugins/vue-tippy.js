import Vue from "vue";
import VueTippy, { TippyComponent } from "vue-tippy/dist/vue-tippy.esm";

Vue.use(VueTippy, {
  animation: "scale",
  directive: "tippy", // => v-tippy
  flipDuration: 0,
  interactive: true,
  placement: "bottom",
  trigger: "focus mouseenter",
});

Vue.component("tippy", TippyComponent);
