<template>
  <div>
    <page-header :title="travel ? travel.name : 'Loading...'">
      <template #actions>
        <button
          v-if="
            travel !== null &&
            $auth.user !== null &&
            $auth.user.role === 'admin'
          "
          type="button"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="toggleStatus"
        >
          {{ travel.isPublic ? 'Unpublish' : 'Publish' }}
        </button>

        <button
          v-if="$auth.user !== null && $auth.user.role === 'admin'"
          type="button"
          class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          @click="onDelete"
        >
          Delete
        </button>

        <nuxt-link
          v-if="$auth.user !== null && $auth.user.role === 'admin'"
          to="/edit"
        >
          <button
            type="button"
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit
          </button>
        </nuxt-link>
      </template>
    </page-header>

    <page-body> TRAVEL PAGE </page-body>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  DeleteTravel,
  Travel,
  TravelQuery,
  TravelQueryVariables,
  UpdateTravel,
} from '~/graphql/generated';

export default Vue.extend({
  name: 'TravelPage',
  layout: 'app',

  data() {
    return {
      travel: null as TravelQuery['travel'] | null,
    };
  },

  apollo: {
    travel: {
      query: Travel,
      variables(): TravelQueryVariables {
        return {
          id: this.$route.params.id,
        };
      },
    },
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },

    async onDelete() {
      if (confirm('Do you really want to delete this travel?')) {
        await this.$apollo.mutate({
          mutation: DeleteTravel,
          variables: {
            id: this.$route.params.id,
          },
        });

        this.$router.replace('/');
      }
    },

    async toggleStatus() {
      if (
        confirm(
          `Do you really want to ${
            this.travel!.isPublic ? 'unpublish' : 'publish'
          } this travel?`
        )
      ) {
        await this.$apollo.mutate({
          mutation: UpdateTravel,
          variables: {
            data: {
              isPublic: !this.travel!.isPublic,
              id: this.travel!.id,
            },
          },
          refetchQueries: [
            { query: Travel, variables: { id: this.$route.params.id } },
          ],
        });
      }
    },
  },
});
</script>