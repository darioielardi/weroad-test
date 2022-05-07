<template>
  <div>
    <page-header title="New Travel">
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
          form="new-travel"
          class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
      </template>
    </page-header>

    <page-body>
      <div class="card">
        <TravelForm :save="save" form-id="new-travel" />
      </div>
    </page-body>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { isApolloError } from '~/utils/errors';
import {
  CreateTravel,
  CreateTravelInput,
  CreateTravelMutation,
  CreateTravelMutationVariables,
} from '~/graphql/generated';

export default Vue.extend({
  name: 'NewTravel',
  layout: 'app',

  methods: {
    cancel() {
      this.$router.replace('/');
    },

    async save(data: CreateTravelInput) {
      try {
        const res = await this.$apollo.mutate<
          CreateTravelMutation,
          CreateTravelMutationVariables
        >({
          mutation: CreateTravel,
          variables: { data },
        });

        this.$router.replace(`/${res.data?.createTravel.id}`);
      } catch (error) {
        if (isApolloError(error)) {
          const errors = error.graphQLErrors.map((e) => e.message);
          if (errors.includes('slug-already-exists')) {
            alert('A travel with this slug already exists');
          }
        }
      }
    },
  },
});
</script>