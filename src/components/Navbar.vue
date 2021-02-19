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
          <v-list-item dense @click="() => {}">
            <v-list-item-title>Update List</v-list-item-title>
          </v-list-item>
          <v-list-item dense @click="() => {}">
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

          <v-list-item>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item>

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
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      group: null,
      drawer: null,
    };
  },
  methods: {
    go(where) {
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
