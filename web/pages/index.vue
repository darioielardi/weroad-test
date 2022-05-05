<template>
  <div class="min-h-full">
    <div class="bg-gray-800 pb-32">
      <nav class="bg-gray-800">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div class="border-b border-gray-700">
            <div class="flex items-center justify-between h-16 px-4 sm:px-0">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <img
                    class="h-8 w-8"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                    alt="Workflow"
                  />
                </div>

                <div class="hidden md:block">
                  <div class="ml-10 flex items-baseline space-x-4">
                    <a
                      v-for="item in navigation"
                      :key="item.name"
                      :href="item.href"
                      :class="[
                        item.current
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'px-3 py-2 rounded-md text-sm font-medium',
                      ]"
                      :aria-current="item.current ? 'page' : undefined"
                      >{{ item.name }}</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <header class="py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold text-white">Travels</h1>
        </div>
      </header>
    </div>

    <main class="-mt-32">
      <div class="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
        <!-- Replace with your content -->
        <div class="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <div class="border-4 border-dashed border-gray-200 rounded-lg h-96" />
        </div>
        <!-- /End replace -->
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { gql } from 'graphql-tag';
import { PaginatedTravels, TravelsQuery } from '~/graphql/generated';

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
  { name: 'Reports', href: '#', current: false },
];

export default Vue.extend({
  name: 'IndexPage',

  data() {
    return {
      navigation,
      travels: [],
    };
  },

  async mounted() {
    const res: TravelsQuery = await this.$graphql.default.request(
      gql`
        query Travels($limit: Int, $offset: Int) {
          travels(limit: $limit, offset: $offset) {
            items {
              id
              name
              slug
              isPublic
            }
            hasMore
          }
        }
      `,
      {
        limit: 10,
        offset: 0,
      }
    );

    console.log(res.travels.items);
  },

  methods: {
    async onLogout() {
      try {
        await this.$auth.logout();
      } catch (e) {
        console.error(e);
      }
    },
  },
});
</script>
