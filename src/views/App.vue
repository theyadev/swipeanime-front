<template>
  <v-app>
    <div class="text-center text-lg-h5 my-5">
      {{ user }}
      <div class="text-center text-lg-subtitle-2">
        has watched {{ list.length }} animes
      </div>
    </div>

    <v-card elevation="2" shaped class="mx-auto my-1 pb-3 pt-0" width="1050">
      <v-card elevation="1" color="dark" dark>
        <v-row no-gutters
          ><v-col v-if="random1 != null" cols="12" sm="4">
            <div class="text-center pa-1 text-sm-h6">
              {{ random1.title.romaji }}
            </div></v-col
          >
          <v-spacer
            ><v-row no-gutters
              ><v-col cols="12" sm="4"
                ><v-btn
                  @click="choose(random1.title.romaji, random2.title.romaji)"
                  class="ma-2"
                  color="orange darken-1"
                  dense
                  dark
                >
                  Choose
                  <v-icon dark right>
                    mdi-checkbox-marked-circle
                  </v-icon>
                </v-btn></v-col
              >
              <v-col cols="12" sm="4"
                ><div class="text-center pa-1 text-md-h6">OR</div></v-col
              ><v-col cols="12" sm="4"
                ><v-btn
                  @click="choose(random2.title.romaji, random1.title.romaji)"
                  class="ma-2"
                  color="orange darken-1"
                  dense
                  dark
                >
                  Choose
                  <v-icon dark right>
                    mdi-checkbox-marked-circle
                  </v-icon>
                </v-btn></v-col
              ></v-row
            >
          </v-spacer>
          <v-col v-if="random2 != null" cols="12" sm="4"
            ><div class="text-center pa-1 text-sm-h6">
              {{ random2.title.romaji }}
            </div></v-col
          >
        </v-row>
      </v-card>
      <v-row no-gutters class="mt-2">
        <v-col v-if="random1 != null" cols="12" sm="4">
          <v-img
            class="mx-auto"
            :aspect-ratio="2 / 3"
            max-width="300"
            lazy-src="https://picsum.photos/id/11/10/6"
            :src="random1.coverImage.extraLarge"
          ></v-img>
        </v-col>
        <v-spacer></v-spacer>
        <v-col v-if="random2 != null" cols="12" sm="4">
          <v-img
            class="mx-auto"
            max-width="300"
            :aspect-ratio="2 / 3"
            lazy-src="https://picsum.photos/id/11/10/6"
            :src="random2.coverImage.extraLarge"
          ></v-img>
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
      random1: null,
      random2: null,
      user: "",
      list: [],
      res: "",
      connected: this.$store.state.connected,
    };
  },
  methods: {
    choose(anime, other) {
      this.$store.state.socket.emit("CHOOSE", {
        choisis: anime,
        refus: other,
        by: this.user,
      });
    },
    ping() {
      this.$store.state.socket.emit("PONG");
    },
    randomAnimes() {
      this.random1 = this.list[
        Math.floor(Math.random() * this.list.length)
      ].media;

      this.random2 = this.list[
        Math.floor(Math.random() * this.list.length)
      ].media;

      while (this.random1 == this.random2) {
        this.random2 = this.list[
          Math.floor(Math.random() * this.list.length)
        ].media;
      }
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

    this.randomAnimes();

    this.$store.state.socket.on("OK", () => {
      this.randomAnimes();
    });

    this.$store.state.socket.on("PONG!", (d) => {
      var newD = new Date().getTime();
      this.res = `PONG! ${newD - d}ms `;
    });
  },
};
</script>
