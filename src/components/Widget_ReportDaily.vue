<template>
  <div
    v-if="is_show"
    class="opacity_1 no_select"
  >

    <Widget_Base
      v-bind="child_widget_base"
    />

    <div
      v-if="!is_minimize"
    >
			<v-container>
				<v-row class="d-flex justify-start">

					<!-- status -->
					<v-col class="col-4">
						<v-container class="mx-0 px-0">
							<v-row class="mx-0 px-0">
								<v-col class="mx-0 px-0 text-h6 white--text font-weight-light">
									Total Time
								</v-col>
								<v-spacer></v-spacer>
								<v-col class="mx-0 px-0 text-h6 white--text font-weight-light">
									{{ text_time_total }} hr
								</v-col>
							</v-row>
						</v-container>
					</v-col>

					<!-- timeline -->
					<v-col>
						<v-timeline
							v-for="item in event_list"
							dense
						>
							<v-timeline-item right small color="white">
								<div class="text-body-1 white--text font-weight-light">
									{{ item[0] }}
								</div>
								<div class="text-body-1 white--text font-weight-light">
									{{ item[1] }} hr
								</div>
							</v-timeline-item>
						</v-timeline>
					</v-col>

				</v-row>
			</v-container>
		</div>

  </div>
</template>


<script>
import Widget_Base from "@/components/Widget_Base";
import { DataServer_registerCallback_DateList, DataServer_registerCallback_EventList } from "@/network/DataServer";
import { getTaskName, getTotalTime } from "@/utility/Utility";

export default {
  name: "Widget_ReportDaily",

  props: [
    "Interface_hookClose",
    "Interface_custom"
  ],

  components: {
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

    // internal
    is_show: true,
    is_minimize: false,

		text_time_total: "0",
		event_list: [],

    // external
    hook_close: null,
    data_custom: null
  }),

  methods: {
		Hook_update(data) {
			// CHECK
			if (data == null) return;

			// ----- event_list -----
			// clear old one
			while (this.event_list.length != 0) this.event_list.pop();

			// push new item
			for (let i = 0; i < data.length; ++i) {
				this.event_list.push([
					getTaskName(data[i][1]),
					getTotalTime([data[i][0]]).toFixed(2)
				]);
			}

			// ----- total time -----
			const time_list = [];
			for (const item of data) {
				time_list.push(item[0]);
			}

			const time_total 			= getTotalTime(time_list);
			this.text_time_total	= time_total.toFixed(2);
		}
  },

  mounted() {
    // external
    this.hook_close		= this.Interface_hookClose;
    this.data_custom	= this.Interface_custom;

    // parameter
    this.child_widget_base.Interface_custom.push(this);

    // status
		const today				= new Date();
		const today_date 	= [today.getFullYear(), today.getMonth() + 1, today.getDate()];
		DataServer_registerCallback_EventList(today_date, this.Hook_update);
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
