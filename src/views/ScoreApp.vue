<template>
  <v-app>
    <div class="text-center text-lg-h5 my-5">
      {{ user }}
      <div class="text-center text-lg-subtitle-2">
        has watched {{ list.length }} animes
      </div>
    </div>

    <v-card elevation="2" class="mx-auto my-1 pb-3 pt-0" width="1050">
      <v-card elevation="1" color="orange darken-2" dark>
        <v-row no-gutters
          ><v-col v-if="random1 != null" cols="12" sm="4">
            <div class="text-center pa-1 text-sm-h6">
              {{ random1.title.romaji }}
            </div></v-col
          >
          <v-spacer><div class="text-center pa-1 text-md-h6">OR</div></v-spacer>
          <v-col v-if="random2 != null" cols="12" sm="4"
            ><div class="text-center pa-1 text-sm-h6">
              {{ random2.title.romaji }}
            </div></v-col
          >
        </v-row>
      </v-card>
      <v-row align="center" justify="center" no-gutters class="mt-2">
        <v-col v-if="random1 != null" cols="12" sm="4">
          <v-img
            @click="choose(random1.title.romaji, random2.title.romaji)"
            class="mx-auto imgHover"
            :aspect-ratio="2 / 3"
            max-width="300"
            lazy-src="../assets/lazyImg.jpg"
            :src="random1.coverImage.extraLarge"
            @mouseover="hover1 = true"
            @mouseleave="hover1 = false"
          ></v-img>
        </v-col>
        <v-spacer>
          <v-container fluid>
            <v-row no-gutters
              ><v-col cols="12" sm="4"
                ><v-btn
                  rounded
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
              <v-spacer></v-spacer>
              <v-col cols="12" sm="4">
                <v-btn
                  rounded
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
          </v-container>
        </v-spacer>
        <v-col v-if="random2 != null" cols="12" sm="4">
          <v-img
            lazy-src="../assets/lazyImg.jpg"
            @click="choose(random2.title.romaji, random1.title.romaji)"
            class="mx-auto imgHover"
            max-width="300"
            :aspect-ratio="2 / 3"
            :src="random2.coverImage.extraLarge"
            @mouseover="hover2 = true"
            @mouseleave="hover2 = false"
          ></v-img>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="ma-10">
      <v-card-title>
        <span class="ml-5">Your List</span>
        <v-spacer></v-spacer>
        <v-btn color="red darken-2" small dense @click="dialog = !dialog">
          <v-icon>mdi-alert</v-icon> Reset
        </v-btn>
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
        item-key="name"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        loading="listSorted.length > 0"
        loading-text="Looks like your list is empty. Start to make some choice now!"
        class="mr-5 ml-5"
        show-expand
      >
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-btn text x-small>
              <v-icon x-small>mdi-cog</v-icon>
            </v-btn>
            <v-btn text x-small @click="getMoreInfo(item)">
              More Info
            </v-btn>
          </td>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card light>
          <v-card-title class="headline">
            Are you sure?
          </v-card-title>

          <v-card-subtitle>This will reset all your data!</v-card-subtitle>

          <v-card-actions>
            <v-btn @click="reset" dark color="error">
              RESET
            </v-btn>
            <v-btn text @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="moreInfo"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card tile v-if="moreInfoAnime">
          <v-toolbar flat dark dense color="orange darken-2">
            <v-btn icon dark @click="closeDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title
              >{{ moreInfoAnime && moreInfoAnime.title.romaji }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-img
            style="  filter: blur(1px);-webkit-filter: blur(1px);"
            :src="moreInfoAnime.bannerImage"
            lazy-src="../assets/lazyImg.jpg"
            height="300px"
          />
          <v-card-text>
            <v-card tile class="mx-auto my-12">
              <v-row no-gutters>
                <v-col cols="12" sm="2">
                  <v-img
                    class="mx-auto"
                    style="border-radius: 2%"
                    :src="moreInfoAnime.coverImage.extraLarge"
                    max-width="200"
                    :aspect-ration="2 / 3"
                  ></v-img
                ></v-col>
                <v-divider vertical></v-divider>
                <v-col cols="12" sm="8">
                  <v-subheader>Description</v-subheader>
                  <div class="ml-4" v-html="moreInfoAnime.description"></div
                ></v-col>
                <v-spacer></v-spacer>
                <v-divider vertical></v-divider>
                <v-col cols="12" sm="1">
                  <v-list-item
                    v-for="genre in moreInfoAnime.genres"
                    :key="genre"
                  >
                    <v-list-item-content>
                      <v-list-item-title class="text-center">{{
                        genre
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
              </v-row>

              <v-card-title>{{ moreInfoAnime.title.romaji }}</v-card-title>

              <v-card-text>
                <v-row align="center" class="mx-0">
                  <v-rating
                    :value="moreInfoAnime.averageScore / 2 / 10"
                    color="amber"
                    dense
                    half-increments
                    readonly
                    size="14"
                  ></v-rating>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on" class="grey--text ml-2">
                        {{ moreInfoAnime.averageScore }}%
                      </span>
                    </template>
                    <span>Global Rating</span>
                  </v-tooltip>

                  <v-rating
                    class="ml-5"
                    :value="moreInfoAnime.percentage / 2 / 10"
                    color="blue"
                    dense
                    half-increments
                    readonly
                    size="14"
                  ></v-rating>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <span class="grey--text ml-2" v-bind="attrs" v-on="on">
                        {{ moreInfoAnime.percentage }}%
                      </span>
                    </template>
                    <span>Your Rating</span>
                  </v-tooltip>
                </v-row>
                <div class="my-4 subtitle-1">
                  {{ moreInfoAnime.title.english }}
                </div>
                <v-divider class="mb-4"></v-divider>
                <v-row no-gutters class="text-center">
                  <v-col cols="12" sm="4">
                    <p><b>Points: </b>{{ moreInfoAnime.points }}</p>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <p><b>Times: </b>{{ moreInfoAnime.times }}</p>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <p><b>Percentage: </b>{{ moreInfoAnime.percentage }}</p>
                  </v-col>
                </v-row>
                <v-divider class="mb-3"></v-divider>
                <div v-for="h in moreInfoAnime.history" :key="h.c + h.r">
                  <v-row no-gutters class="mt-2 mb-2">
                    <v-col cols="12" sm="4">
                      <span v-if="h.c == moreInfoAnime.title.romaji">
                        <v-icon dark left color="green">
                          mdi-arrow-up-bold
                        </v-icon>
                        {{ h.r }}
                      </span>
                      <span v-if="h.r == moreInfoAnime.title.romaji">
                        <v-icon dark left color="red">
                          mdi-arrow-down-bold
                        </v-icon>
                        {{ h.c }}
                      </span>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="12" sm="4">
                      <div v-if="h.date" class="text-right mr-5">
                        {{ format(new Date(h.date), "MM/dd/yyyy") }}
                      </div>
                    </v-col>
                  </v-row>
                </div>
                <v-divider class="mb-4"></v-divider>
                <div class="text-center">
                  <v-btn
                    v-if="moreInfoAnime.blacklist == false"
                    class="ma-2"
                    color="red"
                    @click="blacklist(moreInfoAnime.title.romaji, true)"
                  >
                    Blacklist Anime
                  </v-btn>
                  <v-btn
                    v-if="moreInfoAnime.blacklist == true"
                    class="ma-2"
                    color="green"
                    @click="blacklist(moreInfoAnime.title.romaji, false)"
                  >
                    Unblacklist Anime
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-card-text>

          <div style="flex: 1 1 auto;"></div>
        </v-card>
      </v-dialog>
    </v-card>
  </v-app>
</template>
<style>
.imgHover:hover {
  cursor: pointer;
}
</style>
<script>
import { format } from "date-fns";

export default {
  data() {
    return {
      expanded: [],
      moreInfo: false,
      moreInfoAnime: null,
      dialog: false,
      singleExpand: true,
      hover1: false,
      hover2: false,
      headers: [
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "index",
        },
        { text: "Name", value: "name" },
        { text: "Percentage (%)", value: "percentage" },
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
    closeDialog() {
      this.moreInfo = false;
      setTimeout(() => {
        this.moreInfoAnime = null;
      }, 200);
    },
    getMoreInfo(data) {
      const i = this.list.findIndex((e) => e.media.title.romaji == data.name);
      this.moreInfoAnime = this.list[i].media;
      if (data.blacklist == true) this.moreInfoAnime.blacklist = true;
      else this.moreInfoAnime.blacklist = false;
      this.moreInfoAnime.history = data.history;
      this.moreInfoAnime.times = data.times;
      this.moreInfoAnime.points = data.points;
      this.moreInfoAnime.percentage = data.percentage;
      this.moreInfo = true;
    },
    format,
    getColor(p) {
      if (p > 70) return "green";
      else if (p > 50) return "orange";
      else return "red";
    },
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
    blacklist(anime, state) {
      this.$store.state.socket.emit("BLACKLIST", {
        anime: anime,
        of: this.user,
        state: state,
      });
    },
    reset() {
      this.$store.state.socket.emit("RESET", {
        of: this.user,
        animes: this.list,
      });
      this.$store.state.socket.emit("INIT", {
        list: this.list,
        of: this.user,
      });
      this.$store.state.socket.emit("GET", {
        of: this.user,
      });
      this.dialog = false;
    },
    randomAnimes() {
      this.random1 = this.list[
        Math.floor(Math.random() * this.list.length)
      ].media;

      this.random2 = this.list[
        Math.floor(Math.random() * this.list.length)
      ].media;
      while (this.random1.blacklist == true) {
        this.random1 = this.list[
          Math.floor(Math.random() * this.list.length)
        ].media;
      }
      while (this.random1 == this.random2 && this.random2.blacklist == true) {
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
            percentage: Math.round((value.pts / value.times) * 100),
            points: value.pts,
            times: value.times,
            history: value.history,
            blacklist: value.blacklist || false,
          });
          i++;
        }
      }
      if (this.moreInfoAnime != null) {
        const i = this.listSorted.findIndex(
          (e) => e.name == this.moreInfoAnime.title.romaji
        );
        this.getMoreInfo(this.listSorted[i]);
      }
    });

    this.$store.state.socket.on("OK", () => {
      this.randomAnimes();
    });
  },
};
</script>
