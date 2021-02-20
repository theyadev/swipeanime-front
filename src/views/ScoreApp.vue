<template>
  <v-app>
    <div class="text-center text-lg-h5 my-5">
      {{ user }}
      <div class="text-center text-lg-subtitle-2">
        has watched {{ list.length }} animes
      </div>
    </div>

    <v-card elevation="2" shaped class="mx-auto my-1 pb-3 pt-0" width="1050">
      <v-card elevation="1" color="orange darken-4" dark>
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
                  class="ma-2 mx-auto"
                  color="orange darken-1"
                  dense
                  dark
                >
                <v-icon dark left>
                    mdi-checkbox-marked-circle
                  </v-icon>
                  Choose                 
                </v-btn></v-col
              >
              <v-col cols="12" sm="4"
                ><div class="text-center pa-1 text-md-h6">OR</div></v-col
              ><v-col cols="12" sm="4"
                ><v-btn
                  @click="choose(random2.title.romaji, random1.title.romaji)"
                  class="ma-2 mx-auto"
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
            @click="choose(random1.title.romaji, random2.title.romaji)"
            class="mx-auto imgHover"
            :aspect-ratio="2 / 3"
            max-width="300"
            lazy-src="https://picsum.photos/id/11/10/6"
            :src="random1.coverImage.extraLarge"
          ></v-img>
        </v-col>
        <v-spacer></v-spacer>
        <v-col v-if="random2 != null" cols="12" sm="4">
          <v-img
            @click="choose(random2.title.romaji, random1.title.romaji)"
            class="mx-auto imgHover"
            max-width="300"
            :aspect-ratio="2 / 3"
            lazy-src="https://picsum.photos/id/11/10/6"
            :src="random2.coverImage.extraLarge"
          ></v-img>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="ma-10">
      <v-card-title>
        Sorted List
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        dense
        :search="search"
        :headers="headers"
        :items="listSorted"
        :items-per-page="10"
        loading-text="Loading... Please wait"
        class="mr-5 ml-5"
      ></v-data-table>
    </v-card>
  </v-app>
</template>

<style>
.imgHover:hover {
  cursor: pointer;
}
</style>
<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "index",
        },
        { text: "Name", value: "name" },
        { text: "Percentage", value: "percentage" },
        { text: "Points", value: "points" },
        { text: "Times", value: "times" },
      ],
      search: "",
      list: [],
      random1: null,
      random2: null,
      user: "",
      listSorted: [],
    };
  },
  methods: {
    choose(anime, other) {
      this.$store.state.socket.emit("CHOOSE", {
        choisis: anime,
        refus: other,
        by: this.user,
      });
      this.$store.state.socket.emit("GET", {
        of: this.user,
      });
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
    if (this.$store.state.connected == false) {
      this.$router.push("/connexion");
    }
  },
  mounted() {
    const account = JSON.parse(localStorage.account);
    this.user = account.userName;
    this.list = account.list;

    this.randomAnimes();

    this.$store.state.socket.emit("GET", {
      of: this.user,
    });

    this.$store.state.socket.on("GET", (data) => {
      let x = data.sort(function(a, b) {
        return b[1].pts - a[1].pts || b[1].times - a[1].times;
      });
      const map = new Map(x);

      let i = 1;
      this.listSorted = [];
      for (let [key, value] of map) {
        if (value.times > 0) {
          this.listSorted.push({
            index: i,
            name: key,
            percentage: Math.round((value.pts / value.times) * 100) + "%",
            points: value.pts,
            times: value.times,
          });
          i++;
        }
      }
    });

    this.$store.state.socket.on("OK", () => {
      this.randomAnimes();
    });
  },
};
</script>
