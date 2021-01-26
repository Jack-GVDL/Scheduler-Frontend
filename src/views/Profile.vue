<template>

  <div>
    <Sidebar_Setting
      v-bind:Interface_Setting_show="Child_Setting_show"
      v-bind:Interface_Setting_hide="Child_Setting_hide"
    />

  <!-- widget dashboard -->
  <v-container class="d-flex-row align-start" fluid>

    <v-row>
      <!-- nav bar -->
      <v-app-bar
        color="rgba(100, 110, 120, 0.5)"
        dense
      >
        <v-btn
          icon
          elevation="0"
        >
          <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>
        </v-btn>
        <v-spacer></v-spacer>

        <v-btn
          icon
          elevation="0"
          @click="Handle_refresh();"
        >
          <v-icon color="white">mdi-refresh</v-icon>
        </v-btn>

        <v-btn
          icon
          elevation="0"
          @click="Child_Setting_show = !Child_Setting_show;"
        >
          <v-icon color="white">
            mdi-dots-vertical
          </v-icon>
        </v-btn>
      </v-app-bar>
    </v-row>

    <v-row class="opacity_0">

      <!-- widget: Today -->
      <v-col class="opacity_0">
        <v-card
          class="opacity_1"
        >
          <v-card-title class="backboard white--text text-h2">Today</v-card-title>
          <Timetable />
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  </div>

</template>


<script>
import { update, updateAll } from "@/network/DataServer"
import Timetable from "@/components/Timetable.vue";
import Sidebar_Setting from "@/components/Sidebar_Setting";


export default {
  components: {
    Timetable,
    Sidebar_Setting
  },

  data: () => ({
    dialogSetting: false,

    // interface
    Child_Setting_show: false,
    Child_Setting_hide: false
  }),

  methods: {
    Handle_refresh() {
      // const today = new Date();
      // update([today.getFullYear(), today.getMonth() + 1, today.getDate()], false);
      updateAll(false);
    }
  }
};
</script>


<style scoped>
.opacity_0 {
  background: rgba(0, 0, 0, 0.0);
}

.opacity_1 {
  background: rgba(100, 110, 120, 0.5);
  backdrop-filter: blur(4px);
}

.fillHeight {
  height: auto;
}
</style>
