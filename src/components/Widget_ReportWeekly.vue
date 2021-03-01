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
				<Chart_Time
					v-bind="child_chart"
				/>

			</div>
		</div>

	</div>
</template>


<script>
import Widget_Base from "./Widget_Base";
import Chart_Time from "@/components/Chart_Time";
import {
	getDate_Offset,
	getTotalTime, pad
} from "@/utility/Utility";
import {
	DataServer_registerCallback_EventList,
	DataServer_unregisterCallback_EventList, DataServer_update_EventList
} from "@/network/DataServer";

export default {
	name: "Widget_ReportWeekly",

	props: [
		"Interface_hookClose",
		"Interface_custom"
	],

	components: {
		Widget_Base,
		Chart_Time
	},

	data: () => ({
		// parameter
		child_widget_base: {
			Interface_custom: [],
			Interface_show: true,
			Interface_title: "Weekly Report",

			Interface_hookClose: (item) => {
				item[0].is_show = false;
				if (item[0].hook_close != null) item[0].hook_close(item[0].data_custom);
			},

			Interface_hookMinimize: (item, is_minimize) => {
				item[0].is_minimize = is_minimize;
			}
		},

		child_chart: {
			Interface_data: [],
			Interface_label: []
		},

		// ----- internal -----
		is_show: true,
		is_minimize: false,

		text_graph_mode: "",
		graph_mode_list: [
			"Last Week",
			"Last 15 Days",
			"Last Month"
		],

		// list of date that are needed for graph updating
		graph_date_list: [
		],
		graph_hook_list: [
		],
		graph_time_list: [
		],
		graph_string_list: [
		],

		graph_hook_map: null,

		// ----- external -----
		hook_close: null,
		data_custom: null
	}),

	methods: {
		Handler_selectMenu(index) {
			// set mode
			this.text_graph_mode = this.graph_mode_list[index];

			// get number day that are needed
			let size_day = 0;

			switch (index) {
				case 0:
					size_day = 7;
					break;
				case 1:
					size_day = 15;
					break;
				case 2:
					size_day = 30;
					break;
			}

			// actual select mode
			this.Internal_selectGraph(size_day);
		},

		Internal_selectGraph(size_day) {
			// compute date required
			const today = new Date();

			// clear date
			for (let i = 0; i < this.graph_date_list.length; ++i) {
				const date = this.graph_string_list[i];
				const hook = this.graph_hook_list[i];
				DataServer_unregisterCallback_EventList(date, hook);
			}

			while (this.graph_date_list.length !== 0) this.graph_date_list.pop();
			while (this.graph_hook_list.length !== 0) this.graph_hook_list.pop();
			while (this.graph_time_list.length !== 0) this.graph_time_list.pop();
			while (this.graph_string_list.length !== 0) this.graph_string_list.pop();

			// add new date
			for (let i = 0; i < size_day; ++i) {
				const date = getDate_Offset(today, -i);

				// date
				const date_int = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
				this.graph_date_list.push(date_int);

				// date string
				const date_string = pad(date_int[0], 4) + '-' + pad(date_int[1], 2) + '-' + pad(date_int[2], 2);
				this.graph_string_list.push(date_string);

				// time
				this.graph_time_list.push(0);

				// hook
				let hook = null;

				if (this.graph_hook_map.has(date_string)) {
					hook = this.graph_hook_map.get(date_string);
				} else {
					hook = (data) => {
						if (data == null) return;
						this.Hook_updateDate(data, date_int);
					}
					this.graph_hook_map.set(date_string, hook);
				}

				this.graph_hook_list.push(hook);
				DataServer_registerCallback_EventList(date_int, hook);
			}

			// update graph
			this.child_chart.Interface_data.splice(0, 1, this.graph_time_list);
			this.child_chart.Interface_label.splice(0, 1, this.graph_string_list);

			// update event
			for (let i = 0; i < this.graph_date_list.length; ++i) {
				DataServer_update_EventList(this.graph_date_list[i]);
			}
		},

		Hook_updateDate(data, date) {
			// get index of date in the graph
			const index = this.graph_date_list.findIndex(
				element => date[0] === element[0] && date[1] === element[1] && date[2] === element[2]
			);
			if (index < 0) return;

			// calculate the total time
			let temp_list = [];
			for (const item of data) temp_list.push(item[0]);

			const total_time = parseFloat(getTotalTime(temp_list).toFixed(2));

			// update
			this.graph_time_list.splice(index, 1, total_time);
			this.child_chart.Interface_data.splice(0, 1, this.graph_time_list);
		}
	},

	mounted() {
		// internal
		this.graph_hook_map = new Map();

		this.child_chart.Interface_data.push([]);
		this.child_chart.Interface_label.push([]);

		this.text_graph_mode = this.graph_mode_list[0];
		this.Handler_selectMenu(0);

		// external
		this.hook_close		= this.Interface_hookClose;
		this.data_custom	= this.Interface_custom;

		// parameter
		this.child_widget_base.Interface_custom.push(this);

		// status
		// TODO
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
