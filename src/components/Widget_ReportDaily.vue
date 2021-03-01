<template>
  <div
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
				<v-row class="mx-0 px-0">
					<v-col class="mx-0 px-0 text-h6 white--text font-weight-light">
						Total Time: {{ text_time_total }} hr
					</v-col>
				</v-row>

				<!-- graph select -->
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
								{{ text_graph_mode }}
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
								v-for="(item, index) in graph_mode_list"
								@click="Handler_selectMenu(index)"
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

  </div>
</template>


<script>
import Widget_Base from "@/components/Widget_Base";
import Chart_Event from "@/components/Chart_Event";
import { DataServer_registerCallback_DateList, DataServer_registerCallback_EventList } from "@/network/DataServer";
import { getPalette, getTaskName, getTotalTime } from "@/utility/Utility";


export default {
  name: "Widget_ReportDaily",

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
      Interface_title: "Daily Report",

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
    is_show: true,
    is_minimize: false,

		text_time_total: "0",
		event_list: [],

		text_graph_mode: "",
		graph_mode_list: [
			"Sort by Time",
			"Sort by Event"
		],
		graph_mode: 0,
		tag_time_list: [],

    // external
    hook_close: null,
    data_custom: null
  }),

  methods: {
		Hook_update(data) {
			// CHECK
			if (data == null) return;

			// ----- event_list -----
			// compute tag time table
			const tag_time_table = new Map();

			for (const event of data) {
				const time = getTotalTime([event[0]]);

				for (const tag of event[1]) {
					if (tag[0] === '*') continue;

					// new tag
					if (!tag_time_table.has(tag)) {
						tag_time_table.set(tag, 0);
					}

					// update time
					let time_tag = tag_time_table.get(tag);
					time_tag += time;

					tag_time_table.set(tag, time_tag);
				}
			}

			// update tag time list
			const tag_list = Array.from(tag_time_table.keys());
			this.tag_time_list = [];

			for (let i = 0; i < tag_list.length; ++i) {
				this.tag_time_list.push([
					tag_list[i],
					tag_time_table.get(tag_list[i]),
					getPalette(tag_list[i])
				]);
			}

			// update interface
			this.Internal_updateGraph();

			// ----- total time -----
			const time_list = [];
			for (const item of data) {
				time_list.push(item[0]);
			}

			const time_total 			= getTotalTime(time_list);
			this.text_time_total	= time_total.toFixed(2);
		},

		Handler_selectMenu(index) {
			// set mode
			this.text_graph_mode = this.graph_mode_list[index];
			this.graph_mode = index;

			// sort
			switch (index) {
				case 0:
					this.Internal_sortData_Time();
					break;
				case 1:
					this.Internal_sortData_Name();
					break;
			}
		},

		Internal_updateGraph() {
			// sort
			this.Handler_selectMenu(this.graph_mode);

			// update
			this.child_chart.Interface_data.splice(0, 1, this.tag_time_list);
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
		const today				= new Date();
		const today_date 	= [today.getFullYear(), today.getMonth() + 1, today.getDate()];
		DataServer_registerCallback_EventList(today_date, this.Hook_update);

		this.Handler_selectMenu(0);

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
