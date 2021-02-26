<template>
  <div class="mt-5">
    <v-card
      v-if="userInfo != null"
      shaped
      class="mx-auto mb-5"
      max-width="744"
      outlined
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-img :src="userInfo.avatar.large"></v-img
        ></v-list-item-avatar>

        <v-list-item-content
          ><div class="overline">
            {{ this.user }}
          </div>
          <div class="text-center">
            <v-row no-gutters>
              <v-col cols="12" sm="4"
                >Total Animes: {{ userInfo.statistics.anime.count }}
              </v-col>

              <v-col cols="12" sm="4"
                >Time Watched:
                {{ Math.round(userInfo.statistics.anime.minutesWatched / 60) }}h
              </v-col>

              <v-col cols="12" sm="4"
                >Episodes Watched:
                {{ userInfo.statistics.anime.episodesWatched }}
              </v-col>
            </v-row>
          </div></v-list-item-content
        >
      </v-list-item>
      <v-divider></v-divider>
      <v-row no-gutters>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" block text color="orange darken-2">
              <v-col cols="12" sm="4" v-for="i in 3" :key="i"
                ><div class="text-center">
                  {{ userInfo.statistics.anime.tags[i - 1].tag.name }}
                </div>
              </v-col>
            </v-btn>
          </template>
          <span>Highest Rated Tags</span>
        </v-tooltip>
      </v-row>
      <v-divider></v-divider>
      <v-row no-gutters>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" block text color="grey ">
              <v-col cols="12" sm="4" v-for="i in 3" :key="i"
                ><div class="text-center">
                  {{ userInfo.statistics.anime.genres[i - 1].genre }}
                </div>
              </v-col>
            </v-btn>
          </template>
          <span>Highest Rated Genres</span>
        </v-tooltip>
      </v-row>
      <v-card-actions> </v-card-actions>
    </v-card>
    <v-alert
      type="error"
      dense
      class="mx-auto"
      width="400px"
      v-if="list == null"
    >
      This user never used the site to score anime.
    </v-alert>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: this.$route.params.id,
      userInfo: null,
      list: [],
    };
  },
  methods: {
    async init() {
      const user = await this.$store.state.getUserInfo(this.user);
      this.userInfo = user.data.User;

      let tags = this.userInfo.statistics.anime.tags;
      this.userInfo.statistics.anime.tags = tags.sort(function(a, b) {
        return b.meanScore - a.meanScore;
      });
      let genres = this.userInfo.statistics.anime.genres;
      this.userInfo.statistics.anime.genres = genres.sort(function(a, b) {
        return b.meanScore - a.meanScore;
      });
    },
  },
  mounted() {
    this.init();
    this.$store.state.socket.emit("GET", {
      of: this.user,
    });

    this.$store.state.socket.on("GET", (data) => {
      if (data == null) {
        this.list = null;
        return console.log("Error");
      }
      let x = data.sort(function(a, b) {
        return b[1].pts - a[1].pts || b[1].times - a[1].times;
      });
      const map = new Map(x);

      let i = 1;
      this.list = [];
      for (let [key, value] of map) {
        if (value.times > 0) {
          this.list.push({
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
    });
  },
};
</script>

<style></style>
