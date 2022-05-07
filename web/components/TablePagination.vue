<template>
  <div class="w-full flex justify-end items-center mt-5">
    <p>
      <span class="text-sm text-gray-600">
        Showing {{ pagination.from }} to {{ pagination.to }} of
        {{ pagination.total }}
      </span>
    </p>

    <div class="flex ml-5 space-x-2">
      <button
        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50"
        :disabled="page === 1"
        @click="previous"
      >
        Previous
      </button>

      <button
        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50"
        :disabled="page * rows >= pagination.total"
        @click="next"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TablePagination',

  props: {
    page: {
      type: Number,
      default: 1,
    },
    rows: {
      type: Number,
      default: 10,
    },
    total: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    pagination(): { from: number; to: number; total: number } {
      const { page, rows, total } = this;

      return {
        from: (page - 1) * rows + 1,
        to: Math.min(page * rows, total),
        total,
      };
    },
  },

  methods: {
    previous() {
      this.$emit('change', this.page - 1);
    },
    next() {
      this.$emit('change', this.page + 1);
    },
  },
});
</script>