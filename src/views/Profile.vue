<template>

  <div>
    <Sidebar_DateList
      v-bind:Interface_DateList_show="Child_DateList_show"
      v-bind:Interface_DateList_hide="Child_DateList_hide"
    />
    <Sidebar_Setting
      v-bind:Interface_Setting_show="Child_Setting_show"
      v-bind:Interface_Setting_hide="Child_Setting_hide"
    />

    <!-- nav bar -->
    <v-app-bar
      color="rgba(100, 110, 120, 0.5)"
      elevate-on-scroll
      dense
      app
    >
      <v-btn
        icon
        elevation="0"
      >
        <v-app-bar-nav-icon
          color="white"
          @click="Child_DateList_show = !Child_DateList_show;"
        >
        </v-app-bar-nav-icon>
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

    <!-- widget dashboard -->
    <v-container class="d-flex-row align-start" fluid>

      <v-row style="height: 5vh;">
      </v-row>

      <v-row class="opacity_0" v-for="(item, i) in timetable_list">
        <v-col class="opacity_0">
          <Timetable
            v-bind:Interface_Timetable_data="[i, item]"
            v-on:Interface_Timetable_close="Child_Timetable_close"
          />
        </v-col>
      </v-row>

    </v-container>
  </div>

</template>


<script>
import { update, updateAll } from "@/network/DataServer"
import Timetable from "@/components/Timetable.vue";
import Sidebar_Setting from "@/components/Sidebar_Setting";
import Sidebar_DateList from "@/components/Sidebar_DateList";


export default {
  components: {
    Sidebar_DateList,
    Timetable,
    Sidebar_Setting
  },

  data: () => ({
    // list of timetable
    timetable_list: [
      [2021, 1, 28],
      [2021, 1, 27],
      [2021, 1, 26]
    ],

    // unknown, TODO: find it out what it is
    dialogSetting: false,

    // interface
    Child_Setting_show: false,
    Child_Setting_hide: false,
    Child_DateList_show: false,
    Child_DateList_hide: false,
  }),

  methods: {
    Handle_refresh() {
      // const today = new Date();
      // update([today.getFullYear(), today.getMonth() + 1, today.getDate()], false);
      // updateAll(false);
    },

    Child_Timetable_close(data) {
      console.log(this.timetable_list);
      this.timetable_list.splice(data[0], 1);
      console.log(this.timetable_list);
    }
  },

  mounted() {
  }
};
</script>


<style scoped>
.opacity_0 {
  background: rgba(0, 0, 0, 0.0);
}

.opacity_1 {
  background: rgba(100, 110, 120, 0.3);
  backdrop-filter: blur(2px);
}

.fillHeight {
  height: auto;
}
</style>
