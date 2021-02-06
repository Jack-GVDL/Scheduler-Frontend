<template>

  <v-navigation-drawer
    style="position: fixed;"
    class="opacity_1 tool_no_select"
    width="35vh"
    v-model="is_show"
    temporary
    absolute
  >
    <!-- top bar -->
    <div
      style="height: 5vh;"
      class="mt-2 d-flex justify-space-between align-center"
    >
      <div class="mx-6 white--text text-h5 font-weight-light">Date List</div>
      <v-btn
        class="mx-5"
        icon
        @click="is_show = false;"
      >
        <v-icon color="white">mdi-arrow-left</v-icon>
      </v-btn>
    </div>

    <v-container>
      <v-row>

        <v-col class="mb-0 pb-0">
          <v-btn
            small
            depressed
            color="transparent"
            @click="Handler_sortDate()"
          >
            <v-icon
              small
              color="white"
            >
              mdi-alarm-check
            </v-icon>
            <div
             class="mx-2"
            >
            </div>
            <div
              class="white--text font-weight-light"
            >
              {{ text_sort }}
            </div>
          </v-btn>
        </v-col>

      </v-row>
    </v-container>

    <!-- scrollable-->
    <v-virtual-scroll
      style="height: 90vh;"
      item-height="25"
      :items="date_list"
    >
      <template
        v-slot="{ item }"
      >

        <!-- foreach scrollable item -->
        <v-list-item
          class="my-0 py-0 mx-4 px-0"
        >
          <v-container
            style="height: 25px; z-index: 1;"
            class="date_tag my-0 py-0 mx-0 px-0"
            @click="Handler_selectDateTag(item[0]);"
          >
            <v-row class="my-0 py-0 d-flex justify-start">

              <!-- label for filename -->
              <v-col
                style="padding-top: 1px; padding-bottom: 1px;"
                class="tag_test ml-3 py-0 px-0 col-1"
                :class="item[2]"
              >

              </v-col>

              <!-- filename -->
              <v-col class="my-0 py-0 mx-0 col-8">
                <div
                  style="display: inline-block;"
                  class="grey--text text--lighten-3 text-body-2 font-weight-light"
                >
                  {{ item[1] }}
                </div>
              </v-col>

              <!-- icon for filename -->
              <v-col class="my-0 py-0 col-2 d-flex justify-start">
                <v-icon
                  color="grey"
                  small
                >
                  mdi-alarm-check
                </v-icon>
              </v-col>

            </v-row>
          </v-container>
        </v-list-item>

      </template>
    </v-virtual-scroll>
  </v-navigation-drawer>

</template>


<script>
// Import
import { pad } from "@/utility/Utility"
import {
  ItemManager_addCallback,
  ItemManager_updateItem,
  ItemManager_getItem
} from "@/utility/ItemManager";


// Local
// ...


// Global
export default {
  name: "Sidebar_DateList",

  props: [
    "Interface_DateList_show",
    "Interface_DateList_hide"
  ],

  data: () => ({
    is_show: false,
    date_list: [],
    text_sort: "latest",
    is_sort_latest: true,
    is_sorting: false
  }),

  methods: {
    Handler_sortDate() {
      if (this.is_sort_latest) {
        this.text_sort = "oldest";
        this.is_sort_latest = false;
        this.Internal_sortDateList(this.is_sort_latest);

      } else {
        this.text_sort = "latest";
        this.is_sort_latest = true;
        this.Internal_sortDateList(this.is_sort_latest);
      }
    },

    Handler_selectDateTag(data) {
      // CONFIG
      let index = 0;

      // set date enable list
      const date_list = ItemManager_getItem("DateEnableList");
      if (date_list == null) return;

      // find the date
      index = date_list.findIndex(
        item => item[0][0] === data[0] && item[0][1] === data[1] && item[0][2] === data[2]);
      if (index < 0) return;

      // enable date then update
      date_list[index][1] = true;
      ItemManager_updateItem("DateEnableList");
    },

    Hook_updateDateEnableList(data) {
      // null check
      if (data == null) return;

      // clear previous
      // TODO: may need to check before cleaning the list to improve performance
      while (this.date_list.length != 0) this.date_list.pop();

      // push new
      for (const item of data) {

        // tag label
        let string_label = "";
        if (item[1]) string_label = "tag_selected";
        else         string_label = "tag_not_selected";

        // date
        const string_date =
          pad(item[0][0], 4) + " - " +
          pad(item[0][1], 2) + " - " +
          pad(item[0][2], 2);

        this.date_list.push([item[0], string_date, string_label]);
      }
    },

    Internal_sortDateList(is_sort_latest) {
      // lock
      if (this.is_sorting) return;
      this.is_sorting = true;

      // actual sorting
      this.date_list.sort((a, b) => {
        if (a < b) return is_sort_latest ? -1 : 1;
        if (a > b) return is_sort_latest ? 1 : -1;
        return 0;
      });

      // lock
      this.is_sorting = false;
    }
  },

  mounted() {
    ItemManager_addCallback("DateEnableList", this.Hook_updateDateEnableList);
  },

  watch: {
    Interface_DateList_show: function(new_val, old_val) {
      this.is_show = true;
    },

    Interface_DateList_hide: function(new_val, old_val) {
      this.is_show = false;
    }
  }
};
</script>


<style scoped>
.tag_not_selected {
}

.tag_selected {
  border-left: 4px solid #3cd1c2;
}

.date_tag:hover {
  background-color: rgba(100, 100, 100, 0.2);
}

.opacity_0 {
  background: rgba(0, 0, 0, 0);
  /*backdrop-filter: blur(4px);*/
}

.opacity_1 {
  background: rgba(100, 110, 120, 0.2);
  backdrop-filter: blur(2px);
}


.tool_no_select {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none;   /* Safari */
  /*-khtml-user-select: none;    !* Konqueror HTML *!*/
  -moz-user-select: none;      /* Firefox */
  -ms-user-select: none;       /* Internet Explorer/Edge */
  user-select: none;           /* Non-prefixed version, currently supported by Chrome and Opera */
}


/* ----- Track ----- */
/* width */
::-webkit-scrollbar {
  width: 12px;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgba(150, 160, 170, 0.7);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
