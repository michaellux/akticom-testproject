import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
const routeInfos = [
  {
    path: "/",
    component: () => import("./pages/Home.vue"),
  },
  {
    path: "/client/:id",
    component: () => import("./pages/Client.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routeInfos,
});

export default router;
