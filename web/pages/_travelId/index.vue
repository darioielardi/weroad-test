<template>
  <div>
    <page-header :title="travel ? travel.name : 'Loading...'">
      <template
        v-if="travel && $auth.user && $auth.user.role === 'admin'"
        #actions
      >
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="toggleStatus"
        >
          {{ travel.isPublic ? 'Unpublish' : 'Publish' }}
        </button>

        <button
          type="button"
          class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          @click="onDelete"
        >
          Delete
        </button>

        <nuxt-link :to="'/' + travel.id + '/edit'">
          <button
            type="button"
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit
          </button>
        </nuxt-link>
      </template>
    </page-header>

    <page-body>
      <div
        v-if="travel !== null"
        class="bg-white rounded-lg shadow px-4 py-5 sm:p-0"
      >
        <dl class="sm:divide-y sm:divide-gray-200">
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Travel name</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ travel.name }}
            </dd>
          </div>

          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Travel slug</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ travel.slug }}
            </dd>
          </div>

          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Travel status</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex">
              <travel-status :is-public="travel.isPublic" />
            </dd>
          </div>

          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Number of days</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ travel.numberOfDays }}
            </dd>
          </div>

          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Travel description
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ travel.description }}
            </dd>
          </div>
        </dl>
      </div>

      <div v-if="travel && tours" class="mt-12">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h1 class="text-xl font-semibold text-gray-900">Tours</h1>
          </div>

          <div
            v-if="$auth.user && $auth.user.role === 'admin'"
            class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none"
          >
            <nuxt-link :to="'/' + travel.id + '/tours/new'">
              <button
                type="button"
                class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                New
              </button>
            </nuxt-link>
          </div>
        </div>

        <div
          v-if="travel !== null && tours !== null"
          class="mt-8 flex flex-col"
        >
          <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"
            >
              <div
                class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
              >
                <table class="min-w-full divide-y divide-gray-300">
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
                        Dates
                      </th>

                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Price
                      </th>

                      <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span class="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr v-for="tour in tours.items" :key="tour.id">
                      <td
                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                      >
                        {{ tour.name }}
                      </td>

                      <td
                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                      >
                        {{ new Date(tour.startingDate).toLocaleDateString() }} -
                        {{ new Date(tour.endingDate).toLocaleDateString() }}
                      </td>

                      <td
                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                      >
                        €
                        {{ new Intl.NumberFormat().format(tour.price / 100) }}
                      </td>

                      <td
                        v-if="travel"
                        class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                      >
                        <nuxt-link
                          :to="'/' + travel.id + '/tours/' + tour.id"
                          class="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                          <span class="sr-only">, {{ tour.name }}</span>
                        </nuxt-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </page-body>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  DeleteTravel,
  ToursByTravel,
  ToursByTravelQuery,
  ToursByTravelQueryVariables,
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
      tours: null as ToursByTravelQuery['toursByTravel'] | null,
    };
  },

  apollo: {
    travel: {
      query: Travel,
      variables(): TravelQueryVariables {
        return {
          id: this.$route.params.travelId,
        };
      },
    },

    toursByTravel: {
      query: ToursByTravel,
      variables(): ToursByTravelQueryVariables {
        return {
          travelSlug: this.travel!.slug,
          limit: 5,
          offset: 0,
        };
      },
      update(data: ToursByTravelQuery): void {
        this.tours = data.toursByTravel;
      },
      skip(): boolean {
        return !this.travel;
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
            id: this.$route.params.travelId,
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
        });

        await this.$apollo.queries.travel.refetch();
      }
    },
  },
});
</script>