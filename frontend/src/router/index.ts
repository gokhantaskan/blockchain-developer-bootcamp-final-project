import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/create",
    component: () => import("../views/Create.vue"),
    redirect: { name: "Home" },
    children: [
      {
        path: "user",
        name: "CreateUser",
        component: () => import("../views/create/CreateUser.vue"),
      },
      {
        path: "organization",
        name: "CreateOrganization",
        component: () => import("../views/create/CreateOrganization.vue"),
      },
    ],
  },
  {
    path: "/about",
    name: "About",
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
