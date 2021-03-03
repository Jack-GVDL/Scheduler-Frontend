<template>

  <div v-if="is_show" class="tool_no_select mx-0 px-0 flex-grow-1">

    <!-- top bar -->
    <div
      style="height: 5vh;"
      class="mt-2 d-flex justify-space-between align-center"
    >
      <div class="mx-6 white--text text-h5 font-weight-light">Date List</div>
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
                :class="item[2] ? 'tag_selected' : 'tag_not_selected'"
              >
              </v-col>

              <!-- filename -->
              <v-col class="my-0 py-0 mx-0 px-0 col-8">
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

		menu_text: "",
		menu_index: 0,
		menu_list: [],

    is_sort_latest: true,
    is_sorting: false
  }),

  methods: {
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

		Handler_selectMenu(index) {
    	this.menu_index = index;

    	this.menu_list[this.menu_index].hook();
			this.menu_text = this.menu_list[this.menu_index].name;
		},

    Hook_updateDateEnableList(data) {
      // null check
      if (data == null) return;

      // clear previous
      // TODO: may need to check before cleaning the list to improve performance
      while (this.date_list.length !== 0) this.date_list.pop();

      // push new
      for (const item of data) {

        // date
        const string_date =
          pad(item[0][0], 4) + " - " +
          pad(item[0][1], 2) + " - " +
          pad(item[0][2], 2);

        this.date_list.push([item[0], string_date, item[1]]);
      }
    },

    Internal_sortDateList() {
    	this.menu_list[this.menu_index].hook();
    	this.menu_text = this.menu_list[this.menu_index].name;
    },

		Internal_sortDateList_Date() {
    	this.date_list.sort(
				(a, b) => {
					for (let i = 0; i < 3; ++i) {
						if (a[0][i] === b[0][i])	continue;
						if (a[0][i] < b[0][i]) 		return 1;
						else											return -1;
					}
					return 0;
				}
			);
		},

		Internal_sortDateList_DateReversed() {
			this.date_list.sort(
				(a, b) => {
					for (let i = 0; i < 3; ++i) {
						if (a[0][i] === b[0][i])	continue;
						if (a[0][i] < b[0][i]) 		return -1;
						else											return 1;
					}
					return 0;
				}
			);
		},

		Internal_sortDateList_Enabled() {
    	this.date_list.sort(
				(a, b) => {
					// enable first
					if (a[2] && !b[2]) return -1;
					if (!a[2] && b[2]) return 1;

					// if both are enabled or both are disabled
					// then sort by date
					for (let i = 0; i < 3; ++i) {
						if (a[0][i] === b[0][i])	continue;
						if (a[0][i] < b[0][i]) 		return -1;
						else											return 1;
					}

					return 0;
				}
			);
		},

		Internal_sortDateList_EnabledReversed() {
			this.date_list.sort(
				(a, b) => {
					// disable first
					if (a[2] && !b[2]) return 1;
					if (!a[2] && b[2]) return -1;

					// if both are enabled or both are disabled
					// then sort by date
					for (let i = 0; i < 3; ++i) {
						if (a[0][i] === b[0][i])	continue;
						if (a[0][i] < b[0][i]) 		return -1;
						else											return 1;
					}

					return 0;
				}
			);
		}
  },

  mounted() {
  	this.menu_list = [
			{
				name: "Sort by Date",
				hook: this.Internal_sortDateList_Date
			},
			{
				name: "Sort by Date (Reversed)",
				hook: this.Internal_sortDateList_DateReversed
			},
			{
				name: "Sort by Enabled",
				hook: this.Internal_sortDateList_Enabled
			},
			{
				name: "Sort by Enabled (Reversed)",
				hook: this.Internal_sortDateList_EnabledReversed
			}
		];

  	this.menu_index = 0;
  	this.Internal_sortDateList();
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
