import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

import Vuex from "vuex";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    socket: io("localhost:1336"),
    connected: localStorage.connected || false,
  },
  mutations: {
    connection(state) {
      state.connected = true;
    },
  },
});

import io from "socket.io-client";

new Vue({
  store,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
