<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <ul class="sidebar-list">
    <li class="first">1</li>
    <li class="second">2</li>
    <li class="third">3</li>
  </ul>
</template>

<script setup lang="ts"></script>

<style scoped>
.sidebar-list {
  width: 20vw;
  background: #510fad;
  margin: 0;
}
.sidebar-list * {
  height: 70px;
  color: #510fad;
}
.first {
  background: #ffe700;
}
.second {
  background: #ffed40;
}
.third {
  background: #fff273;
}
</style>
