<template>
  <v-app>
    <Navbar />
    <v-btn @click.prevent="ping" class="mx-auto mt-10" elevation="2"
      >PING</v-btn
    >
    <span class="mx-auto" v-if="res">{{ res }}</span>
    
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue";
export default {
  name: "App",

  components: { Navbar },

  data() {
    return {
      res: "",
      connected: true,
    };
  },
  methods: {
    login() {
      console.log("Not Connected");
    },
    ping() {
      this.$store.state.socket.emit("PONG");
    },
  },
  created() {
    if (localStorage.account) this.connected = true;
  },
  mounted() {
    this.$store.state.socket.on("PONG!", (d) => {
      var newD = new Date().getTime();
      this.res = `PONG! ${newD - d}ms `;
    });
  },
};
</script>
