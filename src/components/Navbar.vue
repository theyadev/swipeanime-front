<template>
  <div>
    <v-app-bar dark dense>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Swipe Anime</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn @click="login" icon v-if="connected == false">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
      <v-menu v-else left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item dense @click="() => {}">
            <v-list-item-title>Profile</v-list-item-title>
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
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-title><b>Home</b></v-list-item-title>
          </v-list-item>
        <v-divider></v-divider>

          <v-list-item>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Profile</v-list-item-title>
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
      drawer: null,
    };
  },
};
</script>
