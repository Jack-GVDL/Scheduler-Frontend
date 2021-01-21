<template>
  <v-app id="background">
    <div>
      <Navbar />
      <router-view id="router" to="/"></router-view>
    </div>
  </v-app>
</template>


<script>
import Navbar from "@/components/Navbar";


export default {
  name: "App",
  components: {
    Navbar
  }
};
</script>


<style scoped>
#background {
  background-image: url('~@/assets/Background.jpg');
}

#router {
  height: auto;
}
</style>
