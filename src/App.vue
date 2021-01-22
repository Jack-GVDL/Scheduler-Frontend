<template>
  <v-app id="background">
    <Profile/>
  </v-app>
</template>


<script>
import Profile from "@/views/Profile";


export default {
  name: "App",
  components: {
    Profile,
  },
  data: () => ({
    sidebar: false
  })
};
</script>


<style scoped>
#background {
  background-image: url('~@/assets/Background.jpg');
}

#router {
  height: auto;
}

.opacity_0 {
  background: rgba(0, 0, 0, 0.0);
}
</style>
