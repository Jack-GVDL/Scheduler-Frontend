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

    <!-- scrollable-->
    <v-virtual-scroll
      style="height: 90vh;"
      item-height="25"
      :items="date_list_display"
    >
      <template
        v-slot="{ item }"
      >

        <!-- foreach scrollable item -->
        <v-list-item
          class="my-0 py-0 mx-4 px-0"
        >
          <v-container
            style="height: 25px;"
            class="date_tag my-0 py-0 mx-0 px-0"
          >
            <v-row class="my-0 py-0 d-flex justify-start">

              <!-- label for filename -->
              <v-col
                style="padding-top: 1px; padding-bottom: 1px;"
                class="tag_test ml-3 py-0 px-0 col-1"
              >

              </v-col>

              <!-- filename -->
              <v-col class="my-0 py-0 mx-0 col-8">
                <div
                  style="display: inline-block;"
                  class="grey--text text--lighten-3 text-body-2 font-weight-light"
                >
                  {{ item }}
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
import { DataServer_registerCallback_DateList, DataServer_update_DateList } from "@/network/DataServer"


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

    // test data
    date_list_display: []
  }),

  methods: {
    updateDateList(data) {
      // check if data valid or not
      if (data == null) return;

      // copy data
      data = Array.from(data);
      data.reverse();

      // clear old data
      while (this.date_list_display.length != 0) this.date_list_display.pop();

      // push new data
      for (const item of data) {
        const string = pad(item[0], 4) + " - " + pad(item[1], 2) + " - " + pad(item[2], 2)
        this.date_list_display.push(string);
      }
    }
  },

  mounted() {
    // test
    // for (let i = 0; i < 200; i++) {
    //   this.date_list_display.push("2021 - 01 - 01");
    // }

    DataServer_registerCallback_DateList(this.updateDateList);
    DataServer_update_DateList();
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
.tag_test {
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