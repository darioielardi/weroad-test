import { NuxtConfig } from '@nuxt/types';

const config: NuxtConfig = {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'WeRoad',
    htmlAttrs: {
      lang: 'en',
      class: 'h-full bg-gray-50',
    },
    bodyAttrs: {
      class: 'h-full',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    'nuxt-graphql-request',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios', '@nuxtjs/auth-next', '@nuxtjs/apollo'],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // TypeScript Configuration: https://go.nuxtjs.dev/config-typescript
  typescript: {
    typeCheck: true,
    ignoreNotFoundWarnings: true,
  },

  modulesDir: ['../node_modules'],

  router: {
    middleware: ['auth'],
  },

  axios: {
    baseURL: 'http://localhost:3001',
  },

  apollo: {
    clientConfigs: {
      default: '~/plugins/apollo/apolloConfig.ts',
    },
    defaultOptions: {
      $query: {
        fetchPolicy: 'cache-and-network',
      },
    },
  },

  auth: {
    strategies: {
      local: {
        token: {
          property: 'access_token',
        },
        user: {
          property: false,
        },
        endpoints: {
          login: { url: '/auth/login', method: 'post' },
          logout: { url: '/auth/logout', method: 'post' },
          user: { url: '/auth/user', method: 'get' },
        },
      },
    },
  },

  googleFonts: {
    families: {
      Inter: true,
    },
  },
};

export default config;
