<script>
import { Bar } from "vue-chartjs";
import { getPalette, registerCallback } from "@/network/dataServer"


export default {
  extends: Bar,
  mounted() {
    // Data
    const WEEK = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ];

    const dataset = {
      labels: WEEK,
      datasets: [
        {
          backgroundColor: "#E53935",
          barPercentage: 0.7,
          data: [4, 2, 3, 5, 9, 1, 1]
        },
        {
          backgroundColor: "#8E24AA",
          barPercentage: 0.7,
          data: [6, 7, 4, 5, 2, 2, 4]
        },
        {
          backgroundColor: "#43A047",
          barPercentage: 0.7,
          data: [6, 7, 4, 5, 2, 2, 4]
        },
        {
          backgroundColor: "#FB8C00",
          barPercentage: 0.7,
          data: [6, 7, 4, 5, 2, 2, 4]
        }
      ]
    };

    const option = {
      scales: {
        yAxes: [
          {
            gridLines: {
              display: true
            },
            stacked: true
          }
        ],
        xAxes: [
          {
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: false
            },
            stacked: true
          }
        ]
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      responsive: true,
      maintainAspectRatio: false,
      height: 100,
      width: 400
    };

    // Function
    this.renderChart(dataset, option);
  }
};
</script>
