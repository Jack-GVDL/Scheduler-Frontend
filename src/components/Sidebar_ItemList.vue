<template>

  <div v-if="is_show" class="tool_no_select mx-0 px-0 flex-grow-1">

    <!-- top bar -->
    <div
      style="height: 5vh;"
      class="mt-2 d-flex justify-space-between align-center"
    >
      <div class="mx-6 white--text text-h5 font-weight-light">{{ title }}</div>
    </div>

    <v-container>
      <v-row>

      </v-row>
    </v-container>

    <!-- scrollable-->
    <v-virtual-scroll
      style="height: 90vh;"
      item-height="25"
      :items="list"
    >
      <template
        v-slot="{ item }"
      >

        <!-- foreach scrollable item -->
        <v-list-item class="my-0 py-0 mx-4 px-0">
          <v-container
            style="height: 25px; z-index: 1;"
            class="date_tag my-0 py-0 mx-0 px-0"
            @click="Handler_select(item);"
          >
            <v-row class="my-0 py-0 d-flex justify-start">

              <!-- label for filename -->
              <v-col
                style="padding-top: 1px; padding-bottom: 1px;"
                class="tag_test ml-3 py-0 px-0 col-1"
                :class="item[3][1]"
              >
              </v-col>

              <!-- filename -->
              <v-col class="my-0 py-0 mx-0 col-8">
                <div
                  style="display: inline-block;"
                  class="white--text text-body-2 font-weight-light"
                >
                  {{ item[1] }}
                </div>
              </v-col>

            </v-row>
          </v-container>
        </v-list-item>

      </template>
    </v-virtual-scroll>

  </div>

</template>


<script>
// Import
// ...


// Local
// ...


// Global
export default {
  name: "Sidebar_ItemList",

  props: [
    "Interface_show",
    "Interface_title",
    "Interface_list",
    "Interface_hookSelect",
    "Interface_custom"
  ],

  data: () => ({
    is_show: false,
    title: "Unknown",
    list: [],
    hook_select: null,
    data_custom: null
  }),

  methods: {
    Handler_select(item) {
      // change tag
      item[2] = !item[2];
      item[3][1] = item[2] ? "tag_selected" : "tag_not_selected";

      // find position of this item in the list
      const index = this.list.findIndex(cur => cur[3][0] === item[3][0]);

      // handler / hook
      if (this.hook_select != null) {
        const is_selected = this.hook_select(item[0], item[2]);
        item[2] = is_selected;
        item[3][1] = item[2] ? "tag_selected" : "tag_not_selected";
      }

      // update
      this.list.splice(index, 1, item);
    },

    Internal_updateList() {
      // check if needed to append memory
      if (this.list.length === 0) return;
      if (this.list[0].length === 3) {
        for (let i = 0; i < this.list.length; ++i) this.list[i].push([0, ""]);
      }

      // set id and tag_selected
      for (let i = 0; i < this.list.length; ++i) {
        this.list[i][3][0] = i;
        this.list[i][3][1] =
          this.list[i][2] ? "tag_selected" : "tag_not_selected";
      }
    }
  },

  mounted() {
  },

  computed: {
  },

  watch: {
    Interface_show: function(new_val, old_val) {
      if (new_val.length < 1) return;
      this.is_show = new_val[0];
    },

    Interface_title: function(new_val, old_val) {
      if (new_val.length < 1) return;
      this.title = new_val[0];
    },

    Interface_list: function(new_val, old_val) {
      this.list = new_val;
      this.Internal_updateList();
    },

    Interface_hookSelect: function(new_val, old_val) {
      if (new_val.length < 1) return;
      this.hook_select = new_val[0];
    },

    Interface_custom: function(new_val, old_val) {
      if (new_val.length < 1) return;
      this.data_custom = new_val[0];
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

.opacity_3 {
  background: rgba(100, 110, 120, 0.4);
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
