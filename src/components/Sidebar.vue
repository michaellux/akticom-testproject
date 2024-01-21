<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <draggable class="sidebar-list" v-model="items" tag="ul">
    <template #item="{ element: item }">
      <li>{{ item }}</li>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import draggable from 'vuedraggable';
const items = ref([
  'Отчёты',
  'Справки',
  'Распоряжения',
  'Справочники',
  'Регламенты',
]);
</script>

<style scoped>
.sidebar-list {
  width: 20vw;
  background: #ffffff;
  margin: 0;
  padding: 0;
}
.sidebar-list * {
  height: 70px;
  color: #510fad;
  line-height: 4em;
}
.first {
  background: #fafaf8;
}
.second {
  background: #ededec;
}
.third {
  background: #ebe6e6;
}
</style>
