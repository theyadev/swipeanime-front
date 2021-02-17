<template>
  <v-app>
      <div class="text-center text-lg-h4 my-5">{{ user }}</div>
      <div class="text-center text-lg-subtitle-2">
        has watched {{ list.length }} animes
      </div>

      <v-card elevation="2" shaped class="mx-auto my-5 pa-3" width="1050">
        <v-row no-gutters>
          <v-col cols="12" sm="4">
            <v-btn align="center"
      justify="center" class="ma-2" color="red" dark>
              Decline
              <v-icon dark right>
                mdi-cancel
              </v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" sm="4">
            <v-img
              class="mx-auto"
              lazy-src="https://picsum.photos/id/11/10/6"
              max-width="450"
              :src="list[0].media.coverImage.extraLarge"
            ></v-img>
          </v-col>
          <v-col cols="12" sm="4">
            <v-btn class="ma-2" color="primary" dark>
              Accept
              <v-icon dark right>
                mdi-checkbox-marked-circle
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <v-btn @click.prevent="ping" class="mx-auto mt-10" elevation="2"
        >PING</v-btn
      >
      <span class="mx-auto" v-if="res">{{ res }}</span>
  </v-app>
</template>
<script>
export default {
  data() {
    return {
      user: "",
      list: [],
      res: "",
      connected: this.$store.state.connected,
    };
  },
  methods: {
    ping() {
      this.$store.state.socket.emit("PONG");
    },
  },
  created() {
    if (this.connected == false) {
      this.$router.push("/connexion");
    }
  },
  mounted() {
    const account = JSON.parse(localStorage.account);
    this.user = account.userName;
    this.list = account.list;

    this.$store.state.socket.on("PONG!", (d) => {
      var newD = new Date().getTime();
      this.res = `PONG! ${newD - d}ms `;
    });
  },
};
</script>
