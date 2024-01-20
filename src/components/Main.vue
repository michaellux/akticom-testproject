<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="main">
    <div class="filters">
      <Filter v-model="name" name="По ФИО" type="byText" />
      <Filter v-model="region" name="По региону" type="byOptions" :options="regions" />
      <Filter v-model="status" name="По статусу" type="byOptions" :options="statuses" />
    </div>
    <table>
      <thead>
        <th v-for="(key, index) in clientListKeys" :key="index">{{ key }}</th>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredClientList" :key="index">
          <td v-for="(val, key) in item" :key="key">{{ val }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import {DateTime} from "ts-luxon";
import clientList from "../data/clients.json";
import { Option } from '../types/Option';
import { ref, computed } from 'vue';
import Filter from "./Filter.vue";
const startClientList = ref(clientList);
const clientListKeys = Object.keys(startClientList.value[0]);
const regions = ref<Option[]>([{id: 'all', name: "Любой"}]);
const statuses = ref<Option[]>([{id: 'all', name: "Любой"}]);
const name = ref('');
const region = ref('Любой');
const status = ref('Любой');
startClientList.value.forEach((item) => {
  let foundRegion = regions.value.find(el => el.name === item.region);
  if (!foundRegion) {
  regions.value = [...regions.value, {
    id: item.id,
    name: item.region
  }];
  }
  let foundStatus = statuses.value.find(el => el.name === item.status);
  if (!foundStatus) {
    statuses.value = [...statuses.value, {
      id: item.id,
      name: item.status
    }];
  }
});
const formattedClientList = startClientList.value.map((item) => {
  return { ...item, created_at: DateTime.fromISO(item.created_at).toFormat("dd/MM/yy") }
});
const filteredClientList = computed(() => {
 return formattedClientList.filter((item) => {
    return (name.value === '' ? true : item.fullname.toLowerCase().includes(name.value.toLowerCase()))
    && (region.value === 'Любой' ? true : item.region === region.value)
    && (status.value === 'Любой' ? true : item.status === status.value);
 });
});
</script>

<style scoped>
  .main {
    width: 80vw;
    height: 85vh;
    background: #8144D6;
    color: white;
  }
  .filters {
    display: flex;
    padding: 1rem;
    gap: 1rem;
  }
</style>