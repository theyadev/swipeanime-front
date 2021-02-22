<template>
  <div id="TU METS TOUT LE HTML DANS CETTE DIV">
    <v-card
      v-if="anime != null"
      :loading="loading"
      class="mx-auto my-12"
      max-width="374"
    >
      <template slot="progress">
        <v-progress-linear
          color="deep-purple"
          height="10"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-img :src="anime.coverImage.extraLarge"></v-img>

      <v-card-title>{{ anime.title.romaji }}</v-card-title>

      <v-card-text>
        <v-row align="center" class="mx-0">
          <v-rating
            :value="anime.averageScore"
            color="amber"
            dense
            half-increments
            readonly
            size="14"
          ></v-rating>

          <div class="grey--text ml-4">
            {{ anime.averageScore }}
          </div>
        </v-row>
        <div class="my-4 subtitle-1">
          {{ anime.title.english }}
        </div>        
        <v-divider class="mb-5"></v-divider>
        <div>
          {{ anime.description }}
        </div>
      </v-card-text>
    </v-card>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: "",
      list: [],
      anime: null,
      loading: true,
    };
  },
  methods: {
    async init() {
      const anime = await this.getAnime(107226);
      anime.averageScore = anime.averageScore / 2 / 10;
      this.anime = anime;
      this.loading = false;
    },
    getAnime(id) {
      // Here we define our query as a multi-line string
      // Storing it in a separate .graphql/.gql file is also possible
      var query = `
query ($id: Int) { # Define which variables will be used in the query (id)
  Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
    id
    title {
      romaji
      english
      native
    }
     coverImage {
            extraLarge
            color
          }
    description
    averageScore
    genres
  }
}
`;

      // Define our query variables and values that will be used in the query request
      var variables = {
        id: id,
      };

      // Define the config we'll need for our Api request
      var url = "https://graphql.anilist.co",
        options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: query,
            variables: variables,
          }),
        };

      // Make the HTTP Api request
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
        //console.log(data.data);
        return data.data.Media;
      }

      function handleError(error) {
        console.error(error);
        return false;
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

    this.init();
  },
};
</script>

<style></style>
