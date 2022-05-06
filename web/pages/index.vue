<template>
  <div>
    <page-header title="Travels">
      <template
        v-if="$auth.user !== null && $auth.user.role === 'admin'"
        #actions
      >
        <nuxt-link to="/new">
          <button
            type="button"
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            New
          </button>
        </nuxt-link>
      </template>
    </page-header>

    <page-body>
      <div v-if="$apollo.queries.travels.loading" class="px-5 py-6 sm:px-6">
        <p>Loading...</p>
      </div>

      <table v-if="travels" class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Name
            </th>

            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Status
            </th>

            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Number of days
            </th>

            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Edit</span>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="travel in travels.items" :key="travel.id">
            <td
              class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
            >
              {{ travel.name }}
            </td>

            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 flex">
              <div
                v-if="travel.isPublic"
                class="bg-green-50 px-2.5 py-1 rounded-lg"
              >
                <span class="text-green-500 font-medium">Public</span>
              </div>

              <div
                v-if="!travel.isPublic"
                class="bg-red-50 px-2.5 py-1 rounded-lg"
              >
                <span class="text-red-400 font-medium">Private</span>
              </div>
            </td>

            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ travel.numberOfDays }}
            </td>

            <td
              class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-4"
            >
              <nuxt-link
                :to="travel.id"
                class="text-indigo-600 hover:text-indigo-900"
              >
                View
                <span class="sr-only">, {{ travel.name }}</span>
              </nuxt-link>

              <nuxt-link
                :to="travel.id + '/edit'"
                class="text-indigo-600 hover:text-indigo-900"
              >
                Edit
                <span class="sr-only">, {{ travel.name }}</span></nuxt-link
              >
            </td>
          </tr>
        </tbody>
      </table>
    </page-body>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  Travels,
  TravelsQuery,
  TravelsQueryVariables,
} from '~/graphql/generated';

export default Vue.extend({
  name: 'IndexPage',
  layout: 'app',

  data() {
    return {
      travels: null as TravelsQuery['travels'] | null,
      pagination: {
        limit: 10,
        offset: 0,
      },
    };
  },

  apollo: {
    travels: {
      query: Travels,
      variables(): TravelsQueryVariables {
        return {
          limit: this.pagination.limit,
          offset: this.pagination.offset,
        };
      },
    },
  },
});
</script>
