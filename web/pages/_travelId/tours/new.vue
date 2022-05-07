<template>
  <div>
    <page-header title="New Tour">
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="cancel"
        >
          Cancel
        </button>

        <button
          type="submit"
          form="new-tour"
          class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
      </template>
    </page-header>

    <page-body>
      <div class="card">
        <tour-form form-id="new-tour" :save="save" />
      </div>
    </page-body>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { CreateTour, CreateTourInput } from '~/graphql/generated';

export default Vue.extend({
  name: 'NewTourPage',
  layout: 'app',

  methods: {
    cancel() {
      this.$router.go(-1);
    },

    async save(data: CreateTourInput) {
      await this.$apollo.mutate({
        mutation: CreateTour,
        variables: {
          data: {
            ...data,
            travelId: this.$route.params.travelId,
          },
        },
      });

      this.$router.go(-1);
    },
  },
});
</script>