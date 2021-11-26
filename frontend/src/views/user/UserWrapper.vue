<template>
  <div class="user-wrapper">
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: "UserWrapper",
};
</script>
