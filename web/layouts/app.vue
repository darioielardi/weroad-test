<template>
  <div class="min-h-full">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <img
                class="block lg:hidden h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                alt="Workflow"
              />
              <img
                class="hidden lg:block h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
                alt="Workflow"
              />
            </div>

            <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <a
                v-for="item in navigation"
                :key="item.name"
                :href="item.href"
                :class="[
                  item.current
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                ]"
                :aria-current="item.current ? 'page' : undefined"
                >{{ item.name }}</a
              >
            </div>
          </div>

          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 text-sm rounded font-medium text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="py-10">
      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
  { name: 'Reports', href: '#', current: false },
];

export default Vue.extend({
  name: 'AppLayout',

  data() {
    return {
      navigation,
    };
  },

  methods: {
    logout() {
      this.$auth.logout();
    },
  },
});
</script>