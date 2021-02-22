<template>
  <v-app>
    <Navbar />

    <router-view />
    <v-footer color="orange darken-1" padless>
      <v-row justify="center" no-gutters>
        <v-col class="orange darken-2 py-4 text-center white--text" cols="12">
          Copyright © {{ new Date().getFullYear() }}
          <strong>Swipe Anime</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue";
export default {
  name: "App",

  components: { Navbar },

  data() {
    return {};
  },
  methods: {
    logIn() {
      const query = `
{
  Viewer {
    id
    name
  }
}`;
      var url = "https://graphql.anilist.co",
        options = {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: query,
          }),
        };

      return fetch(url, options)
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

      function handleError() {
        return false;
      }
    },
    async init() {
      const x = await this.logIn();
      const name = x.data.Viewer.name;
      const id = x.data.Viewer.id;
      const userExist = await this.$store.state.getUser(name, "ANIME");
      const lists = userExist.data.anime.lists;
      let animes = [];
      lists.forEach((e) => {
        e.entries = e.entries.filter(
          (y) =>
            y.status != "PLANNING" &&
            y.status != "PAUSED" &&
            y.status != "DROPPED" &&
            y.media.format != "SPECIAL" &&
            y.media.format != "OVA" &&
            y.media.format != "MUSIC" &&
            y.media.format != "SPECIAL"
        );

        animes = [...animes, ...e.entries];
      });
      localStorage.account = JSON.stringify({
        userName: name,
        id: id,
        list: animes,
      });
      this.$store.state.socket.emit("INIT", {
        list: animes,
        of: name,
      });
      this.$store.commit("connection");
      this.$router.push("/");
    },
  },
  created() {
    let access_token = window.location.hash.split("&")[0].split("=");
    if (access_token[0] != "#access_token") return;
    localStorage.token = access_token[1];
    this.init();
  },
};
</script>
