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
    getUser: function(name, list) {
      const query = `
       query ($userName: String, $type: MediaType) {
  anime: MediaListCollection(userName: $userName, type: $type) {
    user{
      name
    }
    lists {
      entries {
        status
        media {
          type
          id
          bannerImage
          coverImage {
            extraLarge
            color
          }
          title {
            romaji
            english
          }
          format
          synonyms
        }
      }
    }
  }
}
`;

      return fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: query,
          variables: { userName: name, type: list.toUpperCase() },
        }),
      })
        .then(handleResponse)
        .then(handleData)
        .catch(handleError);

      function handleResponse(response) {
        return response.json().then(function(json) {
          return response.ok ? json : Promise.reject(json);
        });
      }

      function handleData(data) {
        return data;
      }

      function handleError(error) {
        console.log(error);
        return false;
      }
    },
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
