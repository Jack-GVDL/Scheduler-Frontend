<template>
  <v-navigation-drawer
    class="opacity_1 no_select"
    v-model="sidebar"
    width="100vh"
    absolute
    temporary
    floating
    right
  >
    <!-- save, load -->
    <template class="mx-0 px-0">
      <v-container class="d-flex justify-start">
        <v-row class="d-flex justify-start">

          <v-col>
            <v-btn
              class="mx-2 error--text text-h6"
              color="transparent"
              elevation="0"
              @click="Handler_close();"
            >
              Close
            </v-btn>

            <v-btn
              class="mx-2 green--text text-h6"
              color="transparent"
              elevation="0"
              @click="Handler_save();"
            >
              Save
            </v-btn>
          </v-col>

        </v-row>
      </v-container>
    </template>

    <v-container
      class="mx-3 my-3 px-3 py-3"
    >

      <v-row>
        <v-col>
          <div class="white--text text-h2 font-weight-light">Setting</div>
        </v-col>
      </v-row>

      <!-- text field - server -->
      <v-row
        class="align-center"
      >
          <div
            style="text-align: right; display: inline-block;"
            class="col-3 mx-1 px-1 white--text text-h6 font-weight-light"
          >
            Server Site
          </div>
        <v-col>
          <v-text-field
            class="mr-10 white--text text-body-1 font-weight-light"
            dark
            v-model="textAddress"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- text field - background image -->
      <v-row
        class="align-center"
      >
        <div
          style="text-align: right; display: inline-block;"
          class="col-3 mx-1 px-1 white--text text-h6 font-weight-light"
        >
          Background Image
        </div>
        <v-col>
          <v-text-field
            dark
            class="mr-10 white--text text-body-1 font-weight-light"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- fullscreen -->
      <v-row class="align-center">
        <v-spacer class="col-1"></v-spacer>
        <v-checkbox
          class="mx-4"
          color="white"
          v-model="isFullScreen"
        ></v-checkbox>
        <div
          class="no_select white--text text-h6 font-weight-light"
          @click="isFullScreen = !isFullScreen;"
        >
          Fullscreen
        </div>
      </v-row>

    </v-container>

  </v-navigation-drawer>
</template>


<script>
// Import
import { getServerAddress, setServerAddress } from "@/network/DataServer"
const { remote } = require("electron");


// Global
export default {
  name: "Sidebar_Setting",

  data: () => ({
    // hide / show
    sidebar: false,

    // text
    textAddress: "",
    textImage: "",

    // is-enabled
    isFullScreen: false
  }),

  props: [
    "Interface_Setting_show",
    "Interface_Setting_hide",
  ],

  methods: {
    // update / reset
    updateForm() {
      this.textAddress  = getServerAddress();
      this.isFullScreen = remote.getCurrentWindow().isFullScreen();
      console.log(this.isFullScreen);
    },

    // handler
    Handler_close() {
      this.sidebar = false;
    },

    Handler_save() {
      // set configuration
      remote.getCurrentWindow().setFullScreen(this.isFullScreen);
      setServerAddress(this.textAddress);

      // hide
      this.sidebar = false;
    }
  },

  watch: {
    Interface_Setting_show: function(newVal, oldVal) {
      this.sidebar = true;

      // update
      this.updateForm();
    },

    Interface_Setting_hide: function(newVal, oldVal) {
      this.sidebar = false;
    }
  }
};
</script>


<style scoped>
.opacity_0 {
  background: rgba(0, 0, 0, 0);
  /*backdrop-filter: blur(4px);*/
}

.opacity_1 {
  background: rgba(100, 110, 120, 0.3);
  backdrop-filter: blur(4px);
}

/*tool*/
.no_select {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none;   /* Safari */
  /*-khtml-user-select: none;    !* Konqueror HTML *!*/
  -moz-user-select: none;      /* Firefox */
  -ms-user-select: none;       /* Internet Explorer/Edge */
  user-select: none;           /* Non-prefixed version, currently supported by Chrome and Opera */
}
</style>