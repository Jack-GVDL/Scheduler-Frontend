<template>
  <div>
    <v-container>
      <v-row>
        <!-- pie chart -->
        <v-col>
          <pie-chart :datasets="dataset" :options="option"></pie-chart>
        </v-col>

        <!-- data table -->
        <v-col>
          <v-data-table :headers="tableheader" :items="tabledata">
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import PieChart from "./PieChart.vue";

export default {
  components: {
    PieChart
  },

  data() {
    return {
      // pie chart
      dataset: {
        datasets: [
          {
            backgroundColor: ["#E53935", "#8E24AA", "#43A047", "#FB8C00"],
            data: [10, 10, 10, 10]
          }
        ]
      },

      option: {
        tooltips: {
          enabled: false
        },
        cutoutPercentage: 50,
        responsive: true,
        maintainAspectRatio: false
      },

      // data table
      tableheader: [
        { text: "Task", value: "task" },
        { text: "Time", value: "time" },
        { text: "Percentage", value: "percentage" }
      ],

      tabledata: [
        { task: "Task", time: "Time", percentage: "Percentage" },
        { task: "Task", time: "Time", percentage: "Percentage" },
        { task: "Task", time: "Time", percentage: "Percentage" },
        { task: "Task", time: "Time", percentage: "Percentage" }
      ]
    };
  }
};
</script>
