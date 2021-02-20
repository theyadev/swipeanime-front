<template>
  <div>{{ user }}</div>
</template>

<script>
export default {
  data() {
    return {
      user: "",
      list: [],
    };
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
  },
};
</script>

<style></style>
