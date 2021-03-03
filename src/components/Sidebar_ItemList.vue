<template>

  <div v-if="is_show" class="tool_no_select mx-0 px-0 flex-grow-1">

    <!-- top bar -->
    <div
      style="height: 5vh;"
      class="mt-2 d-flex justify-space-between align-center"
    >
      <div class="mx-6 white--text text-h5 font-weight-light">{{ title }}</div>
    </div>

		<!-- sort mode -->
		<div class="mx-6 d-flex justify-end">
			<v-menu
				offset-y
			>

				<!-- menu enable button -->
				<template
					class="d-flex align-center"
					v-slot:activator="{ on, attr }"
				>
					<div
						style="margin: auto;"
						class="mx-1 white--text text-body-2 font-weight-light">
						{{ menu_text }}
					</div>
					<v-btn
						dark
						icon
						v-bind="attr"
						v-on="on"
					>
						<v-icon color="white">
							mdi-cogs
						</v-icon>
					</v-btn>
				</template>

				<!-- menu list -->
				<v-list class="opacity_4">
					<v-list-item
						v-for="(item, index) in menu_list"
						@click="Handler_selectMenu(index)"
					>
						<div class="white--text font-weight-light text-body-2">
							{{ item.name }}
						</div>
					</v-list-item>
				</v-list>

			</v-menu>
		</div>

    <!-- scrollable-->
    <v-virtual-scroll
      style="height: 90vh;"
      item-height="25"
      :items="item_list"
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
		"Interface_menu",
    "Interface_hookSelect",
    "Interface_custom"
  ],

  data: () => ({
    is_show: false,
    title: "Unknown",
    list: [],
    hook_select: null,
    data_custom: null,

		item_list: [],

		menu_text: "",
		menu_index: 0,
		menu_list: [],

		is_updated: false
  }),

  methods: {
    Handler_select(item) {
    	// CONFIG
			this.is_updated = false;

			// CORE
      // change tag
      item[2] 		= !item[2];
      item[3][1] 	= item[2] ? "tag_selected" : "tag_not_selected";

      // handler / hook
      if (this.hook_select != null) {
        const is_selected = this.hook_select(item[0], item[2]);
        item[2] 		= is_selected;
        item[3][1] 	= is_selected ? "tag_selected" : "tag_not_selected";
      }

      // update (if there is not update call in hook)
      if (this.is_updated) {
				const index = this.item_list.findIndex(cur => cur[3][0] === item[3][0]);
				this.item_list.splice(index, 1, item);
				this.is_updated = false;
			}
    },

		Handler_selectMenu(index) {
			this.menu_index = index;
			this.Internal_sortList();
		},

    Internal_updateList() {
    	// clear original list
			this.item_list = [];

      // set id and tag_selected
      for (let i = 0; i < this.list.length; ++i) {
      	this.item_list.push([
      		this.list[i][0],
					this.list[i][1],
					this.list[i][2],
					[0, this.list[i][2] ? "tag_selected" : "tag_not_selected"]
				]);
      }

			// sort
			this.Internal_sortList();

      // mark as up to date
			this.is_updated = true;
    },

		Internal_sortList() {
			if (this.menu_list.length === 0) return;
			this.menu_text = this.menu_list[this.menu_index].name;
			this.item_list.sort(this.menu_list[this.menu_index].compare);
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

		Interface_menu: function(new_val, old_val) {
    	if (new_val.length < 1) return;
    	this.menu_list = new_val[0];
    	this.Internal_sortList();
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

.opacity_4 {
	background: rgba(100, 115, 130, 0.7);
	backdrop-filter: blur(8px);
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
