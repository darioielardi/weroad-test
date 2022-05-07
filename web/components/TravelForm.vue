<template>
  <form :id="formId" class="grid grid-cols-6 gap-6" @submit.prevent="onSave">
    <div class="col-span-6 sm:col-span-3">
      <label for="name" class="block text-sm font-medium text-gray-700">
        Name
      </label>

      <input
        id="name"
        v-model="name"
        required
        type="text"
        name="name"
        placeholder="Travel name"
        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      />
    </div>

    <div class="col-span-6 sm:col-span-3">
      <label for="slug" class="block text-sm font-medium text-gray-700">
        Slug
      </label>

      <input
        id="slug"
        v-model="slug"
        required
        type="text"
        name="slug"
        placeholder="Travel slug"
        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      />
    </div>

    <div class="col-span-6 sm:col-span-3">
      <label for="numberOfDays" class="block text-sm font-medium text-gray-700">
        Number of days
      </label>

      <input
        id="numberOfDays"
        v-model.number="numberOfDays"
        required
        type="number"
        name="numberOfDays"
        placeholder="Number of days"
        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      />
    </div>

    <div class="col-span-6">
      <label for="description" class="block text-sm font-medium text-gray-700">
        Description
      </label>

      <textarea
        id="description"
        v-model="description"
        rows="10"
        type="text"
        name="description"
        placeholder="Travel description"
        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      />
    </div>

    <div v-for="mood in moods" :key="mood.label" class="col-span-1">
      <label
        :for="mood.label + '-mood'"
        class="block text-sm font-medium text-gray-700"
      >
        {{ mood.label }}
      </label>

      <input
        :id="mood.label + '-mood'"
        v-model.number="mood.value"
        type="number"
        step="5"
        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      />
    </div>
  </form>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import slugify from 'slugify';
import { CreateTravelInput } from '~/graphql/generated';

export default Vue.extend({
  name: 'TravelForm',

  props: {
    formId: {
      type: String,
      required: true,
    },
    initialData: {
      type: Object as PropType<CreateTravelInput>,
      default(): CreateTravelInput {
        return {
          name: '',
          slug: '',
          description: '',
          numberOfDays: 1,
          natureMood: 0,
          relaxMood: 0,
          historyMood: 0,
          cultureMood: 0,
          partyMood: 0,
        };
      },
    },
    save: {
      type: Function as PropType<(data: CreateTravelInput) => void>,
      required: true,
    },
  },

  data() {
    return {
      name: this.initialData.name,
      slug: this.initialData.slug,
      description: this.initialData.description,
      numberOfDays: this.initialData.numberOfDays,
      moods: {
        nature: {
          label: 'Nature',
          value: this.initialData.natureMood,
        },
        relax: {
          label: 'Relax',
          value: this.initialData.relaxMood,
        },
        history: {
          label: 'History',
          value: this.initialData.historyMood,
        },
        culture: {
          label: 'Culture',
          value: this.initialData.cultureMood,
        },
        party: {
          label: 'Party',
          value: this.initialData.partyMood,
        },
      },
    };
  },

  watch: {
    name(value) {
      this.slug = slugify(value);
    },
  },

  methods: {
    onSave() {
      this.save({
        name: this.name,
        slug: this.slug,
        description: this.description,
        numberOfDays: this.numberOfDays,
        natureMood: this.moods.nature.value,
        relaxMood: this.moods.relax.value,
        historyMood: this.moods.history.value,
        cultureMood: this.moods.culture.value,
        partyMood: this.moods.party.value,
      });
    },
  },
});
</script>