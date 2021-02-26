<template>
  <div>
    <v-app-bar dark dense>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Swipe Anime</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-menu
        v-if="
          this.$store.state.connected == true ||
            this.$store.state.connected == 'true'
        "
        left
        bottom
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item dense @click="update">
            <v-list-item-title>Update List</v-list-item-title>
          </v-list-item>
          <v-list-item dense @click="deco">
            <v-list-item-title>Sign Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute bottom temporary>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="orange--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-title @click="go('HOME')"
              ><b>Home</b></v-list-item-title
            >
          </v-list-item>
          <v-divider></v-divider>
          <div
            v-if="
              this.$store.state.account && this.$store.state.account.userName
            "
          >
            <v-list-item>
              <v-list-item-title
                @click="go('STATS', $store.state.account.userName)"
                >Stats</v-list-item-title
              >
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Blacklist</v-list-item-title>
            </v-list-item>
          </div>
          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-title @click="go('SWIPE')">Swipe</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title @click="go('SCORING')"
              >Scoring</v-list-item-title
            >
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-alert
      v-model="error"
      dense
      dismissible
      elevation="2"
      class="my-3 mx-auto"
      width="1000"
      type="error"
      >Username not found!</v-alert
    >
    <v-alert
      v-model="success"
      dense
      dismissible
      elevation="2"
      class="my-3 mx-auto"
      width="1000"
      type="success"
      >List successfully updated!</v-alert
    >
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      user: "",
      group: null,
      drawer: null,
      loading: false,
      error: false,
      success: false,
    };
  },
  methods: {
    deco() {
      this.$store.state.account = null;
      localStorage.account = null;
      this.$store.commit("connection");
      this.$router.push("/connexion");
    },
    async update() {
      const account = JSON.parse(localStorage.account),
        user = account.userName,
        list = account.list;
      if (this.loading == true) return;
      this.loading = true;
      const userExist = await this.$store.state.getUser(
        user,
        list[0].media.type
      );
      if (userExist == null) {
        this.loading = false;
        this.error = true;
        return;
      }
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
        userName: userExist.data.anime.user.name,
        list: animes,
      });
      this.loading = false;
      this.success = true;
    },
    go(where, user) {
      if (where && user) {
        this.$router.push("/user/" + user);
      }
      switch (where) {
        case "HOME":
          if (this.$route.path == "/") return;
          this.$router.push("/");
          break;

        case "LOGIN":
          if (this.$route.path == "/connexion") return;
          this.$router.push("/connexion");
          break;

        case "SCORING":
          if (this.$route.path == "/scoring") return;
          this.$router.push("/scoring");
          break;

        case "SWIPE":
          if (this.$route.path == "/swipe") return;
          this.$router.push("/swipe");
          break;

        default:
          break;
      }
    },
  },
};
</script>
