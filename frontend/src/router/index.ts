import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import store from "@/store";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: () => import("../views/user/UserWrapper.vue"),
    redirect: { name: "UserProfile" },
    children: [
      {
        path: "",
        component: () => import("../views/user/UserProfile.vue"),
        name: "UserProfile",
      },
    ],
  },
  {
    path: "/organizations",
    component: () => import("../views/organizations/OrganizationsWrapper.vue"),
    redirect: { name: "OrganizationsList" },
    children: [
      {
        path: "",
        component: () => import("../views/organizations/OrganizationsList.vue"),
        name: "OrganizationsList",
      },
      {
        path: ":address",
        component: () => import("../views/organizations/OrganizationProfile.vue"),
        name: "OrganizationProfile",
      },
    ],
  },
  {
    path: "/create-profile",
    name: "CreateUser",
    component: () => import("../views/user/CreateUser.vue"),
  },
  {
    path: "/create-organization",
    name: "CreateOrganization",
    component: () => import("../views/organizations/CreateOrganization.vue"),
  },
  {
    path: "*",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach(async (_to, _from, next) => {
//   await store.dispatch("setSelectedAddress");
//   await store.dispatch("isUser");
//   next();
// });

export default router;
