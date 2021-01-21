<template>
  <v-row justify="center">
    <v-expansion-panels>
      <v-expansion-panel v-for="(item, i) in monthitems" :key="i">
        <v-expansion-panel-header>{{ item.month }}</v-expansion-panel-header>

        <v-expansion-panel-content>
          <!-- <v-virtual-scroll
                        :items="item.list"
                        height="500"
                        item-height="70">

                        <template v-slot="{ listitem }">
                            <v-list-item
                                two-line
                                class="mx-3 py-0" 
                                :class="listitem[2]">
                                <v-layout>
                                
                                    <v-flex sm6 md6 class="mx-3">
                                        <div class="caption grey--text">Task</div>
                                        <div>{{ listitem[0] }}</div>
                                    </v-flex>

                                    <v-flex sm6 md3 hidden-xs-only>
                                        <div class="caption grey--text">Time</div>
                                        <div>{{ listitem[1] }}</div>
                                    </v-flex>

                                </v-layout>
                            </v-list-item>
                        </template>

                    </v-virtual-scroll> -->

          <v-data-table :headers="tableheader" :items="tabledata[item.list]">
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>

<script>
import Timetable from "@/components/Timetable.vue";

export default {
  data: () => ({
    monthitems: [
      { month: "September, 2020", list: "tabledatasep2020" },
      { month: "September, 2020", list: "tabledatasep2020" },
      { month: "September, 2020", list: "tabledatasep2020" },
      { month: "September, 2020", list: "tabledatasep2020" },
      { month: "September, 2020", list: "tabledatasep2020" }
    ],

    // data table
    tableheader: [
      { text: "Date", value: "date" },
      { text: "Time", value: "time" },
      { text: "Task", value: "task" }
    ],

    tabledata: {
      tabledatasep2020: [
        { task: "Task 1", date: "9-1", time: "10:00 - 12:00" },
        { task: "Task 2", date: "9-1", time: "10:00 - 12:00" },
        { task: "Task 3", date: "9-1", time: "10:00 - 12:00" }
      ]
    }
  })
};
</script>

<style scoped></style>
