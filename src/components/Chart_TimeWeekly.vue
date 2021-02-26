<script>
import { Line } from "vue-chartjs"
import { getDate_Offset, getTotalTime, pad } from "@/utility/Utility";
import { DataServer_registerCallback_EventList } from "@/network/DataServer";

export default {
	name: "Chart_TimeWeekly",
	extends: Line,

	data: () => ({
		time_list: [],
		date_int_list: [],
		date_string_list: [],

		chart_data: {},
		chart_option: {}
	}),

	methods: {
		Hook_update(data) {
			// CHECK
			if (data == null) return;

			// calculate the total time
			const temp_list = [];
			for (const item of data) temp_list.push(item[0]);

			const total_time = getTotalTime(temp_list);

			// update
			this.time_list.splice(6, 1, total_time);
			this.renderChart(this.chart_data, this.chart_option);
		}
	},

	mounted() {
		// time list
		for (let i = 0; i < 7; ++i) this.time_list.push(0);

		// get date of date of latest 7 day (today is included)
		// which is then hook to data server
		const today = new Date();

		for (let i = 0; i < 7; ++i) {
			const date = getDate_Offset(today, i);

			// data server
			const date_int = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
			this.date_int_list.push(date_int);
			DataServer_registerCallback_EventList(date_int, this.Hook_update);

			// label
			const date_string = pad(date_int[0], 4) + '-' + pad(date_int[1], 2) + '-' + pad(date_int[2], 2);
			this.date_string_list.push(date_string);
		}

		// chart data
		this.chart_data = {
			datasets: [
				{
					borderColor: "white",
					borderWidth: 1,
					data: this.time_list
				},
			],
			labels: this.date_string_list
		};

		this.chart_option = {
			scales: {
				yAxes: [{
					display: true,
					ticks: {
						fontColor: "white",
						fontSize: 15,
						stepSize: 1,
						min: 0,
						padding: 10
					},
					gridLines: {
						zeroLineColor: "white"
					}
				}],
				xAxes: [{
					display: true,
					ticks: {
						fontColor: "white",
						fontFamily: "Helvetica",
						fontSize: 15,
						padding: 10
					},
					gridLines: {
						zeroLineColor: "white"
					}
				}]
			},
			legend: {
				display: false
			},
			maintainAspectRatio: false,
			responsive: true
		};

		this.renderChart(this.chart_data, this.chart_option);
	},
};
</script>

<style scoped>

</style>