<template>
  <v-app>
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
    <v-card elevation="2" shaped class="mx-auto my-5 pa-3" width="700">
      <v-card-title>Log In</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="name"
            :rules="nameRules"
            label="Anilist Username"
            required
          ></v-text-field>

          <v-select
            v-model="list"
            :items="lists"
            :rules="listRules"
            label="List"
            required
          ></v-select>

          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="validate"
          >
            Validate
          </v-btn>

          <v-btn color="error" class="mr-4" @click="reset">
            Reset Form
          </v-btn>
        </v-form>
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
      error: false,
      loading: false,
      valid: false,
      name: "",
      nameRules: [(v) => !!v || "Your username is required"],
      list: "",
      lists: ["Manga", "Anime"],
      listRules: [(v) => !!v || "A list is required"],
    };
  },
  methods: {
    async validate() {
      if (this.loading == true) return;
      const valid = this.$refs.form.validate();
      if (valid == false) return;
      this.loading = true;
      const userExist = await this.$store.state.getUser(this.name, this.list);
      if (userExist == false) {
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
      this.$store.state.socket.emit("INIT", {
        list: animes,
        of: this.name,
      });
      localStorage.connected = true;
      this.$store.commit("connection");
      this.$router.push("/");
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style></style>
