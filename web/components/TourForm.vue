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
        placeholder="Tour name"
        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      />
    </div>

    <div class="col-span-6 sm:col-span-3">
      <label for="price" class="block text-sm font-medium text-gray-700">
        Price
      </label>

      <input
        id="price"
        v-model.number="price"
        required
        type="text"
        name="price"
        placeholder="Tour price"
        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      />
    </div>

    <div class="col-span-6 sm:col-span-3">
      <label for="startingDate" class="block text-sm font-medium text-gray-700">
        Starting date
      </label>

      <input
        id="startingDate"
        v-model="startingDate"
        required
        type="date"
        name="startingDate"
        placeholder="Starting date"
        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      />
    </div>

    <div class="col-span-6 sm:col-span-3">
      <label for="endingDate" class="block text-sm font-medium text-gray-700">
        Ending date
      </label>

      <input
        id="endingDate"
        v-model="endingDate"
        :disabled="startingDate === ''"
        required
        type="date"
        :min="startingDate"
        name="endingDate"
        placeholder="Ending date"
        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md disabled:opacity-50"
      />
    </div>
  </form>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { CreateTourInput } from '~/graphql/generated';

type FormData = Omit<CreateTourInput, 'travelId'>;

function formatDateString(value: string) {
  const date = new Date(value);
  return date.toISOString().split('T')[0];
}

export default Vue.extend({
  name: 'TourForm',

  props: {
    formId: {
      type: String,
      required: true,
    },
    initialData: {
      type: Object as PropType<FormData>,
      default(): FormData {
        return {
          name: '',
          startingDate: '',
          endingDate: '',
          price: 100000,
        };
      },
    },
    save: {
      type: Function as PropType<(data: FormData) => void>,
      required: true,
    },
  },

  data() {
    return {
      name: this.initialData.name,
      startingDate: this.initialData.startingDate
        ? formatDateString(this.initialData.startingDate)
        : '',
      endingDate: this.initialData.endingDate
        ? formatDateString(this.initialData.endingDate)
        : '',
      price: this.initialData.price / 100,
    };
  },

  watch: {
    startingDate(newValue) {
      if (newValue === '' || new Date(newValue) > new Date(this.endingDate)) {
        this.endingDate = '';
      }
    },
  },

  methods: {
    onSave() {
      this.save({
        name: this.name,
        startingDate: new Date(this.startingDate).toISOString(),
        endingDate: new Date(this.endingDate).toISOString(),
        price: this.price,
      });
    },
  },
});
</script>