import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Profile from "../views/Profile.vue";
// import Analyze from "../views/Analyze.vue";
import Schedule from "../views/Schedule.vue";
import AddTask from "../views/AddTask.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Profile",
    component: Profile
  },
  {
    path: "/addTask",
    name: "AddTask",
    component: AddTask
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile
  },
  // {
  //   path: "/analyze",
  //   name: "Analyze",
  //   component: Analyze
  // },
  {
    path: "/schedule",
    name: "Schedule",
    component: Schedule
  }

  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
