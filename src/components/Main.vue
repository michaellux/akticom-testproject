<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="main">
    <div class="filters">
      <Filter name="По ФИО" type="byText" />
      <Filter name="По региону" type="byOptions" :options="regions" :selectedOption="regions[0]"/>
      <Filter name="По статусу" type="byOptions" :options="statuses" :selectedOption="statuses[0]"/>
    </div>
    <table>
      <thead>
        <th v-for="(key, index) in clientListKeys" :key="index">{{ key }}</th>
      </thead>
      <tbody>
        <tr v-for="(item, index) in formattedClientList" :key="index">
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
import { ref } from 'vue';
import Filter from "./Filter.vue";
const startClientList = ref(clientList);
const clientListKeys = Object.keys(startClientList.value[0]);
const regions = ref<Option[]>([]);
const statuses = ref<Option[]>([]);
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