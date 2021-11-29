<template>
  <div
    class="404 d-flex flex-column align-items-center justify-content-center"
    :class="$style['not-found']"
  >
    <h1>404</h1>
    <p>Not Found</p>

    <router-link to="/">
      Return home
    </router-link>
  </div>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style lang="css" module>
.not-found {
  height: 75vh;
}
</style>
