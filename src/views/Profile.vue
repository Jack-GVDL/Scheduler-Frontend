<template>

  <div>
    <v-navigation-drawer
      style="position: fixed;"
      class="my-0 py-0 opacity_3 tool_no_select"
      width="40vh"
      v-model="is_display_func_side_bar"
      temporary
      absolute
    >
      <v-row style="height: 100vh" class="mx-0 px-0 my-0 py-0">
        <div
          style="width: 6vh;"
          class="my-0 py-0 opacity_3 tool_no_select d-flex flex-column align-center"
        >

          <div style="height: 3vh"></div>

          <v-btn
            class="my-1"
            icon
            @click="Handler_showDateList()"
          >
            <v-icon color="white">calendar_today</v-icon>
          </v-btn>

          <v-btn
            class="my-4"
            icon
            @click="Handler_showAnalyseList()"
          >
            <v-icon color="white">align_vertical_bottom</v-icon>
          </v-btn>

          <v-btn
            class="my-1"
            icon
            @click="Handler_showTodoList()"
          >
            <v-icon color="white">mdi-format-list-checks</v-icon>
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
            class="my-4"
            color="transparent"
            icon
            @click="is_display_func_side_bar = false"
          >
            <v-icon color="white">mdi-arrow-left</v-icon>
          </v-btn>

        </div>

        <!-- date list -->
        <Sidebar_DateList
          v-bind:Interface_DateList_show="Child_DateList_show"
          v-bind:Interface_DateList_hide="Child_DateList_hide"
        />

        <!-- analyse list -->
        <Sidebar_ItemList
          v-bind="child_analyse_list"
        />

        <!-- todo_ list -->
        <Sidebar_ItemList
          v-bind="child_todo_list"
        />

      </v-row>
    </v-navigation-drawer>

    <Sidebar_Setting
      v-bind:Interface_Setting_show="Child_Setting_show"
      v-bind:Interface_Setting_hide="Child_Setting_hide"
    />

    <!-- nav bar -->
    <v-app-bar
      color="rgba(100, 115, 130, 0.5)"
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
          @click="is_display_func_side_bar = !is_display_func_side_bar;"
        >
        </v-app-bar-nav-icon>
      </v-btn>
      <v-spacer></v-spacer>

      <v-slide-x-reverse-transition>
        <div
          class="white--text text-h6 font-weight-light mx-2"
          v-if="is_display_reload_message"
        >
          {{ text_reload_message }}
        </div>
      </v-slide-x-reverse-transition>

      <v-btn
        icon
        elevation="0"
        @click="Handler_refresh();"
      >
        <v-icon :color="color_reload_icon">mdi-refresh</v-icon>
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

      <div style="height: 5vh;"></div>

      <v-row v-for="(item, i) in widget_list">
        <v-col>
          <div
            :is="item[0]"
            v-bind="item[1]"
          >
          </div>
        </v-col>
      </v-row>

      <!-- TODO: need to be replaced by widget_list -->
      <v-row class="opacity_0" v-for="(item, i) in timetable_list">
        <v-col class="opacity_0">
          <Timetable
            v-bind:Interface_Timetable_data="item"
            v-on:Interface_Timetable_close="Child_Timetable_close"
          />
        </v-col>
      </v-row>

    </v-container>
  </div>

</template>


<script>
import {
  DataServer_addDate,
  DataServer_registerCallback_DateList,
  DataServer_update_DateList,
  DataServer_updateAll
} from "@/network/DataServer";
import Timetable from "@/components/Timetable.vue";
import Sidebar_Setting from "@/components/Sidebar_Setting";
import Sidebar_DateList from "@/components/Sidebar_DateList";
import Sidebar_ItemList from "@/components/Sidebar_ItemList";
import Widget_ReportDaily from "@/components/Widget_ReportDaily";
import Widget_Base from "@/components/Widget_Base";
import {
  ItemManager_addCallback,
  ItemManager_getItem,
  ItemManager_setItem,
  ItemManager_updateItem
} from "@/utility/ItemManager";


export default {
  components: {
    Sidebar_DateList,
    Sidebar_ItemList,
    Timetable,
    Sidebar_Setting,
    Widget_Base,
    Widget_ReportDaily
  },

  data: () => ({
    // display control
    is_display_reload_message: false,
    is_display_func_side_bar: false,

    text_reload_message: "Load Success",

    color_reload_icon: "white",

    // list of timetable
    timetable_list: [],

    // widget:          widget that in use
    // widget_template: widget that available to be used
    widget_list: [],
    widget_template_list: [
      ["ReportDaily",   "Widget_ReportDaily",   false]
      // ["ReportWeekly",  "Widget_ReportWeekly",  false,  {}],
      // ["ReportMonthly", "Widget_ReportMonthly", false,  {}]
    ],

    // unknown, TODO: find it out what it is
    dialogSetting: false,

    // interface
    Child_Setting_show: false,
    Child_Setting_hide: false,
    Child_DateList_show: false,
    Child_DateList_hide: false,
    Child_DateList_enableTag: [],

    child_analyse_list: {},
    child_todo_list: {},

    // miscellaneous
    is_table_initiated: false
  }),

  methods: {
    Handler_refresh() {
      this.is_display_reload_message = true;
      DataServer_updateAll();
    },

    Handler_showDateList() {
      this.Child_DateList_show = !this.Child_DateList_show;
      this.child_analyse_list.Interface_show.splice(0, 1, false);
      this.child_todo_list.Interface_show.splice(0, 1, false);
    },

    Handler_showAnalyseList() {
      this.Child_DateList_hide = !this.Child_DateList_hide;
      this.child_analyse_list.Interface_show.splice(0, 1, true);
      this.child_todo_list.Interface_show.splice(0, 1, false);
    },

    Handler_showTodoList() {
      this.Child_DateList_hide = !this.Child_DateList_hide;
      this.child_analyse_list.Interface_show.splice(0, 1, false);
      this.child_todo_list.Interface_show.splice(0, 1, true);
    },

    Child_Timetable_close(data) {
      // CONFIG
      let index = 0;

      // ----- remove from timetable -----
      index = this.timetable_list.findIndex(
        item => item[0] === data[0] && item[1] === data[1] && item[2] === data[2]);
      this.timetable_list.splice(index, 1);

      // ----- enable date -----
      // get DateEnableList
      const date_list = ItemManager_getItem("DateEnableList");
      if (date_list == null) return;

      // find the date
      index = date_list.findIndex(
        item => item[0][0] === data[0] && item[0][1] === data[1] && item[0][2] === data[2]);
      if (index < 0) return;

      // disable date then update
      date_list[index][1] = false;
      ItemManager_updateItem("DateEnableList");
    },

    Hook_updateDateList(data) {
      // null check
      if (data == null) return;

      // ----- generate DateEnableList -----
      const result = [];
      for (const item of data) {
        result.push([item, false]);
      }

      // ----- today, yesterday -----
      // check if the first time initiated
      // if so, then add the today and yesterday dialog
      if (!this.is_table_initiated) {
        const date_today     = new Date();
        const date_yesterday = new Date(date_today.getTime() - 24 * 60 * 60 * 1000);

        const today     = [date_today.getFullYear(),     date_today.getMonth() + 1,     date_today.getDate()];
        const yesterday = [date_yesterday.getFullYear(), date_yesterday.getMonth() + 1, date_yesterday.getDate()];

        // enable today
        for (const item of result) {
          if (today[0] !== item[0][0] || today[1] !== item[0][1] || today[2] !== item[0][2]) continue;
          item[1] = true;
          break;
        }

        // enable yesterday
        for (const item of result) {
          if (yesterday[0] !== item[0][0] || yesterday[1] !== item[0][1] || yesterday[2] !== item[0][2]) continue;
          item[1] = true;
          break;
        }

        this.is_table_initiated = true;
      }

      // ----- keep enable -----
      // enable the date based on old timetable list
      for (const date_old of this.timetable_list) {
        for (const date_new of result) {
          if (date_new[0][0] !== date_old[0] ||
              date_new[0][1] !== date_old[1] ||
              date_new[0][2] !== date_old[2]) {
            continue;
          }

          date_new[1] = true;
          break;
        }
      }

      // reverse result (latest at the front)
      result.reverse();

      // update item "DateEnableList"
      ItemManager_setItem("DateEnableList", result);
    },

    Hook_updateDateEnableList(data) {
      // null check
      if (data == null) return;

      // clear previous
      // TODO: may need to check before cleaning the list to improve performance
      while (this.timetable_list.length != 0) this.timetable_list.pop();

      // add the dialog with the date that is enabled in date enable list
      for (const item of data) {
        if (!item[1]) continue;
        this.timetable_list.push([item[0][0], item[0][1], item[0][2]]);
      }
    },

    Hook_updateServerUpdateStatus(data) {
      if (data == null) return;

      // set text of reload message
      const reload_text_list = [
        "",
        "Reloading",
        "Load Success",
        "Load Failed"
      ];

      this.text_reload_message = reload_text_list[data];

      // if start reloading, the display the reloading message
      if (data === 0) this.is_display_reload_message = true;

      // after loading (whenever it is success or not), make the text fade after a certain time
      if (data === 2 || data === 3) {
        setTimeout(() => {
          this.is_display_reload_message = false;
        }, 1000);
      }

      // set icon color
      if (data === 2) this.color_reload_icon = "white";
      if (data === 3) this.color_reload_icon = "red";
    },

    Internal_createWidget(name, list_index) {
      // get the template
      const index =
        this.widget_template_list.findIndex(
          element => element[0] === name
        );
      if (index < 0) return false;
      const widget_template = this.widget_template_list[index];

      // check if it is enabled or not
      if (widget_template[2] === true) return true;

      // enable / create widget
      // - components
      // - v-bind parameter
      this.widget_list.push(
        [widget_template[1], {
          Interface_hookClose: function(item) {

            // TODO: test
            console.log(item[0].Child_AnalyseList_list);
            item[0].Child_AnalyseList_list[list_index][2] = false;
          },
          Interface_custom: [this]
        }]);

      return true;
    }
  },

  mounted() {
    // ----- date list -----
    const today     = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    DataServer_addDate([today.getFullYear(),     today.getMonth() + 1,     today.getDate()]);
    DataServer_addDate([yesterday.getFullYear(), yesterday.getMonth() + 1, yesterday.getDate()]);

    DataServer_registerCallback_DateList(this.Hook_updateDateList);
    DataServer_update_DateList();

    // ----- date enable list -----
    ItemManager_setItem("DateEnableList", []);
    ItemManager_addCallback("DateEnableList", this.Hook_updateDateEnableList);

    // ----- server update status -----
    ItemManager_addCallback("Server_UpdateStatus", this.Hook_updateServerUpdateStatus);

    // ----- sub-sidebar -----
    this.Child_DateList_show = !this.Child_DateList_show;

    // analyse list
    this.child_analyse_list = {
      Interface_show:       [false],
      Interface_title:      ["Analyse"],
      Interface_hookSelect: [function(item, is_selected) {
        if (!is_selected) return true;
        if (!item[0].Internal_createWidget(item[1])) return false;
        return true;
      }],
      Interface_list: [
          [[this, "ReportDaily",   0],  "Daily Report",   false],
          [[this, "ReportWeekly",  1],  "Weekly Report",  false],
          [[this, "ReportMonthly", 2],  "Monthly Report", false]
      ],
      Interface_custom: [this]
    };

    this.child_todo_list = {
      Interface_show:   [false],
      Interface_title:  ["Todo"],
      Interface_hookSelect: [null],
      Interface_custom: [this]
    };

    // ----- widget list -----
    // ...
  }
};
</script>


<style scoped>
.opacity_0 {
  background: rgba(0, 0, 0, 0.0);
}

.opacity_1 {
  background: rgba(100, 115, 130, 0.3);
  backdrop-filter: blur(1px);
}

.opacity_3 {
  background: rgba(100, 115, 130, 0.35);
  backdrop-filter: blur(2px);
}

.fillHeight {
  height: auto;
}
</style>
