import Vue from "vue";
import VueRouter from "vue-router";
import App from "../views/App.vue";
import Connexion from "../views/Connexion.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "App",
    component: App,
  },
  {
    path: "/connexion",
    name: "Connexion",
    component: Connexion,
  },
  /*{
    path: '/connexion',
    name: 'Connexion',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Connexion.vue')
  } ,*/
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
