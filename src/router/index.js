import Vue from "vue";
import VueRouter from "vue-router";
import ScoreApp from "../views/ScoreApp.vue";
import SwipeApp from "../views/SwipeApp.vue";
import Connexion from "../views/Connexion.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    alias: "/scoring",
    name: "ScoreApp",
    component: ScoreApp,
  },{
    path: "/swipe",
    name: "SwipeApp",
    component: SwipeApp,
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
