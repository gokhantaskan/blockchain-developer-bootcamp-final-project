<template>
  <div class="organizations-wrapper">
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
  name: "OrganizationsWrapper",
};
</script>
