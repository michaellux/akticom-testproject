<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="main">
    <div v-if="dataLoaded" class="filters">
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
import axios from 'axios';
import { Option } from '../types/Option';
import { Client } from "../types/Client";
import { ref, computed } from 'vue';
import Filter from "./Filter.vue";
const dataLoaded = ref<boolean>(false);
const rawData = ref();
const startClientList = ref();
const regions = ref<Option[]>([{id: 'all', name: "Любой"}]);
const statuses = ref<Option[]>([{id: 'all', name: "Любой"}]);
const name = ref('');
const region = ref('Любой');
const status = ref('Любой');
const clientListKeys = ref<String[]>([]);
const formattedClientList = ref<Client[]>([]);

axios.get("https://api.jsonbin.io/v3/b/65ab8e911f5677401f21affe", {
  headers: {
    "X-Master-Key": "$2a$10$JOYEwsK0HhcGPLkI0zEMjO5WNZX4lEjIqaCaHG33KNHb8BiVxUaVi"
  }
}).then((data) => {
  rawData.value = data;
  startClientList.value = rawData.value.data.record;
  clientListKeys.value = Object.keys(startClientList.value[0]);

  startClientList.value.forEach((item: Client) => {
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

  dataLoaded.value = true;

  formattedClientList.value = startClientList.value.map((item: Client) => {
    return { ...item, created_at: DateTime.fromISO(item.created_at).toFormat("dd/MM/yy") }
  });
});

const filteredClientList = computed(() => {
 return formattedClientList.value.filter((item: Client) => {
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