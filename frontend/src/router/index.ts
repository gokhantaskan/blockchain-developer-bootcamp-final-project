import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

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
      {
        path: "create",
        name: "CreateUser",
        component: () => import("../views/user/CreateUser.vue"),
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
      {
        path: "create",
        name: "CreateOrganization",
        component: () => import("../views/organizations/CreateOrganization.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
