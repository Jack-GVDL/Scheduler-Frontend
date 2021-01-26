<template>
  <v-app
    :style="css_property"
    id="background"
  >
    <Profile/>
  </v-app>
</template>


<script>
import Profile from "@/views/Profile";
import { ItemManager_addCallback, ItemManager_setItem } from "@/utility/ItemManager";
import backgroundImage from "@/assets/Background_3.jpg"


export default {
  name: "App",
  components: {
    Profile,
  },
  data: () => ({
    sidebar: false,
    css_property: {
      backgroundImage: 'url(' + backgroundImage + ')'
    }
  }),

  methods: {
    Callback_BackgroundImage(value) {
      this.css_property.backgroundImage = 'url(' + value + ')';
    }
  },

  mounted: function() {
    ItemManager_setItem("BackgroundImage", backgroundImage, false);
    ItemManager_addCallback("BackgroundImage", this.Callback_BackgroundImage);
  }
};
</script>


<style scoped>
#background {
  /*background-image: url('~@/assets/Background_3.jpg');*/
  /*background-color: rgb(100, 100, 100);*/
  background-size: cover;
  background-attachment: fixed;
}
</style>
