<script>
import Chart from "chart.js";
import { Pie } from "vue-chartjs";

export default {
  extends: Pie,
  props: ["datasets", "options"],

  mounted() {
    this.renderChart(this.datasets, this.options);
  }
};
</script>
