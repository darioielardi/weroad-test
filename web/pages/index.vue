<template>
  <div>
    <div v-if="$apollo.queries.travels.loading">
      <p>Loading...</p>
    </div>

    <ul v-if="travels">
      <li v-for="travel in travels.items" :key="travel.id">
        <p>{{ travel.name }}</p>
      </li>
    </ul>
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
