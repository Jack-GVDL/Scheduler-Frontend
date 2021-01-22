<template>
  <v-container fluid>
    <v-row class="opacity_0">

      <!-- widget: Today -->
      <v-col class="opacity_0">
        <v-card
          class="opacity_1"
        >
          <v-card-title class="backboard white--text text-h2">Today</v-card-title>
          <Timetable />
        </v-card>
      </v-col>
    </v-row>

    <v-row>
<!--      &lt;!&ndash; widget: This Week &ndash;&gt;-->
<!--      <v-col>-->
<!--        <v-card color="grey lighten-5">-->
<!--          <v-card-title>Last Week</v-card-title>-->
<!--          <WeeklyChart />-->
<!--        </v-card>-->
<!--      </v-col>-->

<!--      &lt;!&ndash; widget: This Month &ndash;&gt;-->
<!--      <v-col>-->
<!--        <v-card color="grey lighten-5">-->
<!--          <v-card-title>This Month</v-card-title>-->
<!--          <MonthlyChart />-->
<!--        </v-card>-->
<!--      </v-col>-->
      <!-- </v-row>

      <v-row> -->
      <!-- widget: This Year -->
<!--      <v-col>-->
<!--        <v-card color="grey lighten-5">-->
<!--          <v-card-title>This Year</v-card-title>-->
<!--          <YearlyChart />-->
<!--        </v-card>-->
<!--      </v-col>-->
    </v-row>
  </v-container>
</template>

<script>
import Timetable from "@/components/Timetable.vue";

export default {
  components: {
    Timetable
  }
};
</script>

<style scoped>
#container {
  background-color: rgba(0, 0, 0, 0);
}

.opacity_0 {
  background: rgba(0, 0, 0, 0.0);
}

.opacity_1 {
  background: rgba(100, 110, 120, 0.5);
  backdrop-filter: blur(4px);
}

.fillHeight {
  height: auto;
}
</style>
