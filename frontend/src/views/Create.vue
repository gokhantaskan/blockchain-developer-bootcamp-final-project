<template>
  <transition
    name="fade"
    mode="out-in"
  >
    <div class="container">
      <router-view />
    </div>
  </transition>
</template>

<script>
export default {
  name: "Create",
};
</script>
