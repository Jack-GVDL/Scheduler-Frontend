<template>
  <v-card
		flat
    v-if="is_show"
    class="opacity_1 no_select"
  >

    <Widget_Base
      v-bind="child_widget_base"
    />

    <div
      v-show="!is_minimize"
    >
			<div class="mx-6 mt-6">

				<!-- total time -->
<!--				<v-row class="mx-0 px-0">-->
<!--					<v-col class="mx-0 px-0 text-h6 white&#45;&#45;text font-weight-light">-->
<!--						Total Time: {{ text_time_total }} hr-->
<!--					</v-col>-->
<!--				</v-row>-->

				<!-- filter select -->
				<div class="d-flex justify-end">
					<v-menu offset-y>

						<!-- menu enable button -->
						<template
							class="d-flex align-center"
							v-slot:activator="{ on, attr }"
						>
							<div
								style="margin: auto;"
								class="mx-2 white--text text-body-1 font-weight-light">
								{{ text_sort_mode }}
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
								v-for="(item, index) in text_mode_list"
								@click="Handler_selectMenu_Sort(index)"
							>
								<div class="white--text font-weight-light text-body-2">
									{{ item }}
								</div>
							</v-list-item>
						</v-list>

					</v-menu>
				</div>

				<!-- day select -->
				<div class="d-flex justify-end">
					<v-menu offset-y>

						<!-- menu enable button -->
						<template
							class="d-flex align-center"
							v-slot:activator="{ on, attr }"
						>
							<div
								style="margin: auto;"
								class="mx-2 white--text text-body-1 font-weight-light">
								{{ text_day_mode }}
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
								v-for="(item, index) in day_mode_list"
								@click="Handler_selectMenu_Day(index)"
							>
								<div class="white--text font-weight-light text-body-2">
									{{ item }}
								</div>
							</v-list-item>
						</v-list>

					</v-menu>
				</div>

				<!-- chart -->
				<v-row>
					<v-col>
						<Chart_Event
							v-bind="child_chart"
						/>
					</v-col>
				</v-row>

			</div>
		</div>

  </v-card>
</template>


<script>
import Widget_Base from "@/components/Widget_Base";
import Chart_Event from "@/components/Chart_Event";
import {
	DataServer_registerCallback_DateList,
	DataServer_registerCallback_EventList,
	DataServer_unregisterCallback_EventList
} from "@/network/DataServer";
import { getDate_Offset, getPalette, getTaskName, getTotalTime, pad } from "@/utility/Utility";


export default {
  name: "Widget_ReportEvent",

  props: [
    "Interface_hookClose",
    "Interface_custom"
  ],

  components: {
		Chart_Event,
    Widget_Base
  },

  data: () => ({
    // parameter
    child_widget_base: {
      Interface_custom: [],
      Interface_show: true,
      Interface_title: "Event",

			Interface_hookClose: (item) => {
				item[0].is_show = false;
				if (item[0].hook_close != null) item[0].hook_close(item[0].data_custom);
			},

			Interface_hookMinimize: (item, is_minimize) => {
				item[0].is_minimize = is_minimize;
			}
    },

		child_chart: {
    	Interface_data: [null],
			Interface_custom: []
		},

    // internal
    is_show: 			true,
    is_minimize: 	false,

		text_time_total: "0",

		text_sort_mode: "",
		text_mode_list: [
			"Sort by Time",
			"Sort by Event"
		],
		sort_mode: 0,

		text_day_mode: "",
		day_mode_list: [
			"Today",
			"Last 7 day",
			"Last 15 day",
			"Last 30 day"
		],
		day_mode: 0,
		size_day: 1,

		is_updating: false,
		is_delay_update: false,

		// format: [item_name, time, color]
		tag_time_list: 	[],
		date_list:			[],
		hook_list:			[],
		hook_map: 			null,

    // external
    hook_close: null,
    data_custom: null
  }),

  methods: {
		Hook_updateDate(data, date) {
			// get index
			const index = this.date_list.findIndex(
				element => {
					return element[0][0] === date[0] &&
								 element[0][1] === date[1] &&
								 element[0][2] === date[2]
				}
			);
			if (index < 0) return;

			// compute event and time
			const map = new Map();
			for (let i = 0; i < data.length; ++i) {
				const event_list 	= data[i][1];
				const time				= getTotalTime([data[i][0]]);

				for (const event of event_list) {
					// ignore special tag
					if (event[0] === '*') continue;
					if (event[0] === '`') continue;

					if (!map.has(event)) map.set(event, 0);
					const item = map.get(event);
					map.set(event, item + time);
				}
			}

			// push to date_list
			this.date_list[index][1] = map;

			// update graph
			this.Internal_updateGraph();
		},

		Handler_selectMenu_Sort(index) {
			this.text_sort_mode = this.text_mode_list[index];
			this.sort_mode 			= index;
			this.Internal_updateSort();
		},

		Handler_selectMenu_Day(index) {
			this.text_day_mode 	= this.day_mode_list[index];
			this.day_mode 			= index;
			this.Internal_updateDay();
		},

		Internal_updateSort() {
			// sort
			switch (this.sort_mode) {
				case 0:
					this.Internal_sortData_Time();
					break;

				case 1:
					this.Internal_sortData_Name();
					break;
			}

			// actual update
			this.child_chart.Interface_data.splice(0, 1, this.tag_time_list);
		},

		Internal_updateDay() {
			// set size_day
			const table 	= [1, 7, 15, 30];
			this.size_day = table[this.day_mode];

			// actual update
			// compute date required
			const today = new Date();

			// clear date
			for (let i = 0; i < this.date_list.length; ++i) {
				const date_int	= this.date_list[i][0];
				const hook 			= this.hook_list[i];
				DataServer_unregisterCallback_EventList(date_int, hook);
			}

			this.date_list 	= [];
			this.hook_list 	= [];

			// add new date
			for (let i = 0; i < this.size_day; ++i) {
				const date = getDate_Offset(today, -i);

				// date string
				const date_int 		= [date.getFullYear(), date.getMonth() + 1, date.getDate()];
				const date_string = pad(date_int[0], 4) + '-' + pad(date_int[1], 2) + '-' + pad(date_int[2], 2);

				// date
				this.date_list.push([date_int, new Map()]);

				// hook
				let hook = null;
				if (this.hook_map.has(date_string)) {
					hook = this.hook_map.get(date_string);
				} else {
					hook = (data) => {
						if (data == null) return;
						this.Hook_updateDate(data, date_int);
					}
					this.hook_map.set(date_string, hook);
				}
				this.hook_list.push(hook);
			}

			// register callback
			for (let i = 0; i < this.date_list.length; ++i) {
				const date_int 	= this.date_list[i][0];
				const hook			= this.hook_list[i];
				DataServer_registerCallback_EventList(date_int, hook);
			}
		},

		Internal_updateGraph() {
			// delay update
			if (this.is_updating) {
				this.is_delay_update = true;
				return;
			}
			this.is_updaing 			= true;
			this.is_delay_update 	= false;

			// CONFIG
			const map = new Map();

			// foreach date, then foreach event
			// compute the total time for every event
			for (let index_date = 0; index_date < this.date_list.length; ++index_date) {
				for (let event of this.date_list[index_date][1].keys()) {
					const time = this.date_list[index_date][1].get(event);

					if (!map.has(event)) map.set(event, 0);
					const item = map.get(event);
					map.set(event, item + time);
				}
			}

			// clear table
			this.tag_time_list = [];

			// push to table
			for (const event of map.keys()) {
				const time = map.get(event);
				this.tag_time_list.push([
					event,
					time,
					getPalette(event)
				])
			}

			// sort
			this.Internal_updateSort();

			// delay update
			this.is_updating = false;
			if (this.is_delay_update) this.Internal_updateGraph();
		},

		Internal_sortData_Time() {
			this.tag_time_list.sort(
				function(a, b) {
					if (a[1] < b[1]) return 1;
					if (a[1] > b[1]) return -1;
					return 0;
				}
			);
		},

		Internal_sortData_Name() {
			this.tag_time_list.sort(
				function(a, b) {
					if (a[0] < b[0]) return -1;
					if (a[0] > b[0]) return 1;
					return 0;
				}
			);
		}
  },

  mounted() {
		// internal
		this.hook_map = new Map();

		this.Handler_selectMenu_Day(0);
		this.Handler_selectMenu_Sort(0);

    // external
    this.hook_close		= this.Interface_hookClose;
    this.data_custom	= this.Interface_custom;

    // parameter
    this.child_widget_base.Interface_custom.push(this);
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

.opacity_4 {
	background: rgba(100, 115, 130, 0.7);
	backdrop-filter: blur(8px);
}

.theme--light.v-timeline:before {
	background: white;
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
