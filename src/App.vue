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
import backgroundImage from "@/assets/Background.jpg"


export default {
  name: "App",
  components: {
    Profile,
  },
  data: () => ({
    sidebar: false,
    // background_image: backgroundImage,
    css_property: {
      backgroundImage: 'url(' + backgroundImage + ')'
    }
  }),

  methods: {
    Callback_BackgroundImage(value) {
      // this.background_image = value;
      this.css_property.backgroundImage = 'url(' + value + ')';
    }
  },

  mounted: function() {
    ItemManager_addCallback("BackgroundImage", this.Callback_BackgroundImage);
    ItemManager_setItem("BackgroundImage", backgroundImage, false);
  }
};
</script>


<style scoped>
#background {
  /*background-image: url('~@/assets/Background.jpg');*/
  /*background-color: rgb(100, 100, 100);*/
  background-attachment: fixed;
}
</style>
