<template>
  <Nuxt />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'DefaultLayout',
});
</script>

<style>
#__nuxt {
  height: 100%;
}

#__layout {
  height: 100%;
}

.card {
  @apply bg-white rounded-lg shadow px-5 py-6 sm:px-6;
}
</style>
