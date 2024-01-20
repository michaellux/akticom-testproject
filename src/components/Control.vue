<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="filter-block">
    <label for="">{{ name }}: </label>
    <input v-model="modelTextValue" v-if="type === 'byText'" type="text">
    <select v-else-if="type === 'byOptions'" v-model="modelTextValue">
      <option v-for="option in options" :key="option.id" :value="option.name">
        {{ option.name }}
      </option>
   </select>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, withDefaults, defineModel } from 'vue';
import { Option } from '../types/Option';

export interface Props {
  type: "byText" | "byOptions",
  name: string
  options?: Array<Option>,
}

const props = withDefaults(defineProps<Props>(), {
  type: "byText",
})

// eslint-disable-next-line no-undef
const modelTextValue = defineModel();

let options = ref(props.options);
</script>

<style scoped>

</style>