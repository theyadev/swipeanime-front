<template>
  <v-app>
    <v-card elevation="2" shaped class="mx-auto my-5 pa-3" width="700">
      <v-card-text>
        <v-btn color="success" block class="mr-4" @click="validate">
          Log In with Anilist
        </v-btn>
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script>
export default {
  created() {
    if (this.$store.state.connected == "true") {
      this.$router.push("/");
    }
  },
  data() {
    return {
      name: "",
      nameRules: [(v) => !!v || "Your username is required"],
      list: "",
      lists: ["Manga", "Anime"],
      listRules: [(v) => !!v || "A list is required"],
    };
  },
  methods: {
    async validate() {
      window.location.href =
        "https://anilist.co/api/v2/oauth/authorize?client_id=4924&response_type=token"; 
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style></style>
