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
