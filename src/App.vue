<template>
  <div class="container">
    <Sidebar />
    <Main />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Sidebar from './components/Sidebar.vue';
import Main from './components/Main.vue';
export default defineComponent({
  name: 'App',
  components: {
    Sidebar, Main
  }
});
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.container {
  display: flex;
}
</style>
