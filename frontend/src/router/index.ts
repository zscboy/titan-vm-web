import Vue from "vue";
import VueRouter from "vue-router";
import VMList from "../views/VMList.vue";
import Login from "../views/Login.vue";
import HostList from "../views/HostList.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: Login
  },
  {
    path: "/vms/:host",
    name: "vmlist",
    component: VMList
  },
  {
    path: "/hosts",
    name: "hostlist",
    component: HostList
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem("token");
//   if (to.path !== "/login" && !token) {
//     next("/login"); // 未登录跳转
//   } else {
//     next(); // 允许访问
//   }
// });

export default router;
