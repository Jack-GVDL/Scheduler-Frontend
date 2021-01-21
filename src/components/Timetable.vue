<template>
  <v-card
    flat
    class="opacity_0"
  >
    <!-- sort -->
    <v-container
      class="opacity_0 my-0"
      fluid
    >
      <!-- sort by task -->
      <v-layout row class="opacity_0">
        <v-btn small depressed color="transparent" class="opacity_0 mx-3 text-body-1 font-weight-light" @click="sortEventListByName();">
          <v-icon left small :color="colorTask">folder</v-icon>
          <span class="white--text">By Task</span>
        </v-btn>

        <!-- sort by time -->
        <v-btn small depressed color="transparent" class="opacity_0 mx-3 text-body-1 font-weight-light" @click="sortEventListByTime();">
          <v-icon left small :color="colorTime">folder</v-icon>
          <span class="white--text">By Time</span>
        </v-btn>
      </v-layout>
    </v-container>

    <!-- table title -->
    <!-- <v-container class="my-0" fluid>
			<v-layout row class="mx-3">

				<v-flex sm6 md6>
					<span>Task</span>
				</v-flex>

				<v-flex sm6 md3 hidden-xs-only>
					<span>Time</span>
				</v-flex>

				<v-flex md3 hidden-sm-and-down>
					<span>Tag</span>
				</v-flex>

			</v-layout>
		</v-container> -->

    <v-divider></v-divider>

    <!-- scrollable to display time tab -->
    <v-virtual-scroll :items="eventList" height="600" item-height="70">
      <template v-slot="{ item }">

        <v-list-item
          dense
          class="event_tag mx-3 py-0"
          :class="item[2]"
        >
          <v-container
            @click="Handler_showEventDetail(item[5]);"
            class="px-0 mx-0 py-0 justify-start"
          >
            <v-row class="justify-space-between">

              <v-col  class="col-6 col-sm-6 col-md-5 col-mx-5 d-block justify-start">
                <div class="justify-start">
                  <div class="caption white--text text-caption font-weight-light">Task</div>
                  <p class="white--text text-h6 font-weight-light">{{ item[0] }}</p>
                </div>
              </v-col>

              <v-col class="col-2 col-sm-5 col-md-2 d-none d-sm-flex justify-start">
                <div>
                  <div class="caption white--text text-caption font-weight-light">Time</div>
                  <p class="white--text text-h6 font-weight-light">{{ item[1] }}</p>
                </div>
              </v-col>

              <v-col class="col-3 col-md-4 d-none d-md-flex justify-start">
                <div class="right">
                  <v-chip
                    dark
                    class="mx-1 text-body-1 font-weight-light"
                    v-for="(tag, i) in item[3]"
                    :color="item[4][i]"
                    :key="i"
                    >{{ tag }}</v-chip>
                </div>
              </v-col>

              <v-col class="col-1 col-sm-1 col-md-1 d-none d-sm-flex justify-end">
                <div class="justify-space-between">
                  <v-icon
                    class="mx-1"
                    color="white"
                    @click.stop="Handler_configEvent(item[5]);"
                  >
                    mdi-cogs
                  </v-icon>
                  <v-icon
                    class="mx-1"
                    color="error"
                    plain
                    @click.stop="Handler_rmEvent(item[5]);"
                  >
                    delete
                  </v-icon>
                </div>
              </v-col>

            </v-row>
          </v-container>
        </v-list-item>

      </template>
    </v-virtual-scroll>
  </v-card>
</template>


<script>
import { getPalette, registerCallback, rmEvent } from "@/network/dataServer";


// Data
const INDEX_TASK      = 0;
const INDEX_DATE      = 1;
const INDEX_PROGRESS  = 2;
const INDEX_TAG_LIST  = 3;
const INDEX_TAG_COLOR = 4;
const INDEX_INDEX     = 5;


// Local Function
// https://stackoverflow.com/questions/2998784/how-to-output-numbers-with-leading-zeros-in-javascript
function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}


function compareEventTime(a, b) {
  if (a[1] < b[1]) return -1;
  if (a[1] > b[1]) return 1;
  return 0;
}


function compareEventName(a, b) {
  if (a[0] < b[0]) return -1;
  if (a[0] > b[0]) return 1;
  return 0;
}


// Global Function
export default {
  data: () => ({
    eventList: [],

    // sortedBy
    // 1: time
    // 2: name
    sortedBy: 1,
    lockSorting: false,

    // TODO: need this before the reason why the array data is corrupted when
    //  it is nav to another page and back
    flagBlockSingleDataUpdate: false,

    colorTask: "grey",
    colorTime: "grey"
  }),

  computed: {
  },

  methods: {
    updateEventList: function(data) {
      // remove old item
      while (this.eventList.length > 0) this.eventList.pop();

      // add new item
      for (let i = 0; i < data.length; i++) {

        // append for palette
        const item         = [...data[i]];
        const paletteList  = [];
        for (let indexTag = 0; indexTag < item[3].length; indexTag++) {
          paletteList.push(getPalette(item[3][indexTag]));
        }

        item.push(paletteList);

        // time
        item[1] =
          pad(item[1][0], 2) + ':' + pad(item[1][1], 2) +
          " - " +
          pad(item[1][2], 2) + ':' + pad(item[1][3], 2);

        // the ground truth index
        item.push(i);

        // add to eventList
        this.eventList.push(item);
      }

      // sort
      if (this.sortedBy === 1) this.sortEventListByTime();
      else                     this.sortEventListByName();
    },

    sortEventListByTime: function() {
      // lock
      if (this.lockSorting) return;
      this.lockSorting = true;

      // actual sorting
      this.eventList.sort(compareEventTime);
      this.sortedBy = 1;
      this.setTagColor();

      // lock
      this.lockSorting = false;

      // flag
      this.flagBlockSingleDataUpdate = true;
    },

    sortEventListByName: function() {
      // lock
      if (this.lockSorting) return;
      this.lockSorting = true;

      // actual sorting
      this.eventList.sort(compareEventName);
      this.sortedBy = 2;
      this.setTagColor();

      // lock
      this.lockSorting = false;

      // flag
      this.flagBlockSingleDataUpdate = true;
    },

    setTagColor: function() {
      switch (this.sortedBy) {
        // time
        case 1:
          this.colorTask = "grey";
          this.colorTime = "blue";
          break;

        // name
        case 2:
          this.colorTask = "blue";
          this.colorTime = "grey";
      }
    },

    Handler_rmEvent: function(index) {
      const today = new Date();
      // rmEvent([today.getFullYear(), today.getMonth() + 1, today.getDate()], index);

      console.log("Need warning dialog");
    },

    Handler_configEvent: function(index) {
      console.log("Config event");
    },

    Handler_showEventDetail: function(index) {
      console.log("Show event");
    }
  },

  mounted() {
    const today = new Date();
    registerCallback(
      [today.getFullYear(), today.getMonth() + 1, today.getDate()],
      this.updateEventList
    );
  },

  updated() {
    // // update data
    // if (!this.flagBlockSingleDataUpdate) {
    //   const today = new Date();
    //
    //   update([today.getFullYear(), today.getMonth() + 1, today.getDate()]);
    // }
    //
    // // reset flag
    // this.flagBlockSingleDataUpdate = false;
  }
};
</script>


<style scoped>
.passed {
  border-left: 4px solid #3cd1c2;
}
.ongoing {
  border-left: 4px solid orange;
}
.future {
  border-left: 4px solid tomato;
}

.event_tag:hover {
  background-color: rgba(100, 100, 100, 0.2);
}

.opacity_0 {
  background: rgba(100, 110, 120, 0.0);
}

.opacity_1 {
  background: rgba(100, 110, 120, 0.8);
}
</style>
