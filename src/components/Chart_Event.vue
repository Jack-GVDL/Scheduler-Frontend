<script>
import { HorizontalBar  } from "vue-chartjs"


export default {
	name: "Chart_Event",
	extends: HorizontalBar,

	props: [
		"Interface_data",
		"Interface_label"
	],

	data: () => ({
		chart_data: {},
		chart_option: {},

		data: {
			data: [],
			backgroundColor: "white",
			borderColor: "white",
			label: []
		},

		tag_time_list: [],

		// sort mode
		// 0: time
		// 1: tag name
		sort_mode: 0
	}),

	methods: {
		Internal_updateData() {
			// clear data in data
			this.data.data = [];
			this.data.backgroundColor = [];
			this.data.borderColor = [];
			this.data.label = [];

			// move data from tag_time_list to data
			for (let i = 0; i < this.tag_time_list.length; ++i) {
				this.data.data.push(						parseFloat(this.tag_time_list[i][1].toFixed(2)));
				this.data.backgroundColor.push(	this.tag_time_list[i][2]);
				this.data.borderColor.push(			this.tag_time_list[i][2]);
				this.data.label.push(						this.tag_time_list[i][0]);
			}

			this.chart_data.datasets[0].data 						= this.data.data;
			this.chart_data.datasets[0].backgroundColor = this.data.backgroundColor;
			this.chart_data.datasets[0].borderColor 		= this.data.borderColor;
			this.chart_data.labels 											= this.data.label;

			// update chart
			this.renderChart(this.chart_data, this.chart_option);
		}
	},

	mounted() {
		// chart data
		this.chart_data = {
			datasets: [
				{
					data: this.data.data,
					backgroundColor: this.data.backgroundColor,
					borderColor: this.data.borderColor,
					borderWidth: 1.5,
					barThickness: 25,
					barPercentage: 0.9,
					categoryPercentage: 0.9
				}
			],
			labels: this.data.label
		};

		this.chart_option = {
			scales: {
				yAxes: [{
					display: true,
					ticks: {
						fontColor: "white",
						fontSize: 16,
						stepSize: 1,
						padding: 10
					},
					gridLines: {
						display: false,
						zeroLineColor: "white"
					},
					scaleLabel: {
						display: true
					},
					position: "left"
				}],
				xAxes: [{
					display: true,
					ticks: {
						fontColor: "white",
						fontSize: 16,
						padding: 10,
						stepSize: 0.5,
						min: 0
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
			maintainAspectRatio: false,
			responsive: true
		};

		// update chart
		this.renderChart(this.chart_data, this.chart_option);
	},

	watch: {
		Interface_data(new_value, old_value) {
			this.tag_time_list = Array.from(new_value[0]);
			this.Internal_updateData();
		}
	}
};
</script>


<style scoped>

</style>
