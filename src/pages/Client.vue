<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container">
    <h1>Client №{{currentClient?.id}}</h1>
    <p>ФИО: {{ currentClient?.fullname }}</p>
    <p>Телефон {{ currentClient?.phone }}</p>
    <p>Регион {{ currentClient?.region }}</p>
    <p>Статус {{ currentClient?.status }}</p>
    <p>Запись создана: {{ currentClient?.created_at }}</p>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import { useRoute } from 'vue-router'
  import { Client } from "@/types/Client";
  const currentClient = ref<Client>();
  const route = useRoute();
 onMounted(() => {
    const localCurrentClient = JSON.parse(localStorage.getItem("currentClient")!) as Client;
    if (route.params.id === `${localCurrentClient.id}`) {
     currentClient.value = localCurrentClient; 
    }
 })
 onBeforeUnmount(() => {
    localStorage.removeItem("currentClient");
 })
</script>

<style scoped>
.container {
  flex-direction: column;
}
</style>