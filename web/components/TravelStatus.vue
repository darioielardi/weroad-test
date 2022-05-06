<template>
  <div
    :class="{
      'px-2.5 py-1 rounded-lg': true,
      'bg-red-50': !isPublic,
      'bg-green-50': isPublic,
    }"
  >
    <span
      :class="{
        'text-red-400': !isPublic,
        'text-green-500': isPublic,
        'font-medium': true,
      }"
    >
      {{ !isPublic ? 'Private' : 'Public' }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TravelStatus',

  props: {
    isPublic: {
      type: Boolean,
      required: true,
    },
  },
});
</script>