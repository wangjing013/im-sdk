import * as VueRouter from "vue-router";

import Home from "@/views/Home.vue";

const routes = [{ path: "/", component: Home }];
export const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

export default {};
