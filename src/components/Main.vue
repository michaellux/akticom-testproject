<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="main">
    <div v-if="dataLoaded" class="filters">
      <strong>Фильтры</strong>
      <Control v-model="name" name="По ФИО" type="byText" />
      <Control v-model="region" name="По региону" type="byOptions" :options="regions" />
      <Control v-model="status" name="По статусу" type="byOptions" :options="statuses" />
    </div>
    <table class="table">
      <thead>
        <th v-for="(key, index) in clientListKeys" :key="index">{{ key }}</th>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredClientList" :key="index">
          <td v-for="(val, key) in item" @click="navigateToClientDetails(item.id)" :key="key">
            {{ val }}
          </td>
          <button @click="removeClient(item.id)">Удалить</button>
        </tr>
      </tbody>
    </table>
    <div v-if="dataLoaded" class="addclient-block">
      <strong>Добавление</strong>
      <Control @keydown.enter="addClient" v-model="addName" name="ФИО" type="byText" />
      <Control @keydown.enter="addClient" v-model="addPhone" name="Телефон" type="byText" />
      <Control v-model="addRegion" name="Регион" type="byOptions" :options="regions.filter((item) => item.name !== 'Любой')" />
      <Control v-model="addStatus" name="Статус" type="byOptions" :options="statuses.filter((item) => item.name !== 'Любой')" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import {DateTime} from "ts-luxon";
  import { Option } from '../types/Option';
  import { Client } from "../types/Client";
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useClientsStore } from "../store";
  import Control from "./Control.vue";
  const dataLoaded = ref<boolean>(false);
  const startClientList = ref();
  const regions = ref<Option[]>([{id: 'all', name: "Любой"}]);
  const statuses = ref<Option[]>([{id: 'all', name: "Любой"}]);
  const name = ref('');
  const region = ref('Любой');
  const status = ref('Любой');
  const addName = ref('');
  const addPhone = ref('');
  const addRegion = ref('');
  const addStatus = ref('');
  const clientListKeys = ref<String[]>([]);
  const formattedClientList = ref<Client[]>([]);
  const clientStore = useClientsStore();

  onMounted(() => {
    fetchData();
  });

  const fetchData = async () => {
    await clientStore.getClientsData();
    if (clientStore.clients) {
      fillData();
    }
  };

  const filteredClientList = computed(() => {
    return formattedClientList.value.filter((item: Client) => {
        return (name.value === '' ? true : item.fullname.toLowerCase().includes(name.value.toLowerCase()))
        && (region.value === 'Любой' ? true : item.region === region.value)
        && (status.value === 'Любой' ? true : item.status === status.value);
    });
  });

  const fillData = () => {
    console.log(clientStore.clients);
      startClientList.value = clientStore.clients;
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

      addRegion.value = regions.value[1].name;
      addStatus.value = statuses.value[1].name;

      formattedClientList.value = startClientList.value.map((item: Client) => {
        return { 
          id: item.id, 
          fullname: item.fullname, 
          created_at: DateTime.fromISO(item.created_at).toFormat("dd/MM/yy"),
          phone: item.phone,
          region: item.region,
          status: item.status
        }
      });
  };

  const addClient = () => {
    console.log("addClient");
    const newClient = {
      fullname: addName.value,
      phone: addPhone.value,
      region: addRegion.value,
      status: addStatus.value
    };
    clientStore.addClient(newClient);
    fillData();
  }

  const removeClient = (clientId: number) => {
    clientStore.removeClient(clientId); 
    fillData();
  }

  const router = useRouter();
  const navigateToClientDetails = (clientId: number) => {
    const currentItem = filteredClientList.value.find(el => el.id === clientId);
    localStorage.setItem('currentClient', JSON.stringify(currentItem));
    router.push(`/client/${clientId}`);
  };
</script>

<style scoped>
  .main {
    width: 80vw;
    height: 85vh;
    background: transparent;
    color: rgb(17, 16, 16);
  }
  .filters {
    display: flex;
    padding: 1rem;
    gap: 1rem;
  }
  .table {
    padding: 1rem;
  }
  .addclient-block {
    display: flex;
    padding: 1rem;
    gap: 1rem;
  }
</style>