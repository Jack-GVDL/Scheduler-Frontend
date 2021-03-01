<script>
import { Line } from "vue-chartjs"
import { getDate_Offset, getTotalTime, pad } from "@/utility/Utility";
import { DataServer_registerCallback_EventList, DataServer_update_EventList } from "@/network/DataServer";
import { ItemManager_getKeyList } from "@/utility/ItemManager";


export default {
	name: "Chart_Time",
	extends: Line,

	props: [
		"Interface_data",
		"Interface_label"
	],

	data: () => ({
		chart_data: {},
		chart_option: {}
	}),

	methods: {

	},

	mounted() {
		// chart data
		this.chart_data = {
			datasets: [
				{
					borderColor: "white",
					borderWidth: 1,
					data: []
				},
			],
			labels: []
		};

		this.chart_option = {
			scales: {
				yAxes: [{
					display: true,
					ticks: {
						fontColor: "white",
						fontSize: 16,
						stepSize: 1,
						min: 0,
						padding: 10
					},
					gridLines: {
						zeroLineColor: "white"
					},
					scaleLabel: {
						display: true
					}
				}],
				xAxes: [{
					display: true,
					ticks: {
						fontColor: "white",
						fontSize: 16,
						padding: 10
					},
					gridLines: {
						zeroLineColor: "white"
					},
					scaleLabel: {
						display: true
					}
				}]
			},
			legend: {
				display: false
			},
			animation: {
				duration: 1
			},
			tooltips: {
				enabled: true
			},
			maintainAspectRatio: false,
			responsive: true
		};

		this.renderChart(this.chart_data, this.chart_option);
	},

	watch: {
		Interface_data(new_value, old_value) {
			this.chart_data.datasets[0].data = new_value[0];
			this.renderChart(this.chart_data, this.chart_option);
		},

		Interface_label(new_value, old_value) {
			this.chart_data.labels = new_value[0];
			this.renderChart(this.chart_data, this.chart_option);
		}
	}
};
</script>


<style scoped>

</style>

