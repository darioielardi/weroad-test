<template>
  <div class="min-h-full">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <img
                class="block lg:hidden h-10 w-auto"
                src="~/assets/weroad-logo-symbol.png"
                alt="WeRoad"
              />

              <img
                class="hidden lg:block h-14 w-auto"
                src="~/assets/weroad-logo-symbol.png"
                alt="WeRoad"
              />
            </div>

            <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <nuxt-link
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                :class="[
                  item.current
                    ? 'border-brand text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                ]"
                :aria-current="item.current ? 'page' : undefined"
                >{{ item.name }}</nuxt-link
              >
            </div>
          </div>

          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 text-sm rounded font-medium text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
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
  { name: 'Dashboard', href: '/', current: true },
  { name: 'Team', href: '#' },
  { name: 'Projects', href: '#' },
  { name: 'Calendar', href: '#' },
  { name: 'Reports', href: '#' },
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
      this.$auth.logout().then(() => {
        this.$router.push('/login');
      });
    },
  },
});
</script>