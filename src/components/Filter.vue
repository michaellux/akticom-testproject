<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="filter-block">
    <label for="">{{ name }}: </label>
    <input v-model="filterSearchValue" v-if="type === 'byText'" type="text">
    <select v-else-if="type === 'byOptions'" v-model="selectedOption">
      <option v-for="option in options" :key="option.id" :value="option.id">
        {{ option.name }}
      </option>
   </select>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, withDefaults } from 'vue';
import { Option } from '../types/Option';

export interface Props {
  type: "byText" | "byOptions",
  name: string
  options?: Array<Option>,
  selectedOption?: Option,
}

const props = withDefaults(defineProps<Props>(), {
  type: "byText"
})

let options = ref(props.options);
let selectedOption = ref(props.selectedOption);
let filterSearchValue = ref("");
</script>

<style scoped>

</style>