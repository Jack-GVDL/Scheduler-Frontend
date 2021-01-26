<template>
  <v-card
    flat
    class="opacity_0 no_select"
  >

    <!-- top -->
    <v-container
      class="opacity_0"
      fluid
    >
      <v-row>
        <v-col>
          <div class="mx-8 mb-2 white--text text-h6 font-weight-light">Total Time: {{ textTimeTotal }} hr</div>
        </v-col>
      </v-row>

      <v-row
        class="my-0"
      >

        <v-col>
          <!-- sort by task -->
          <v-btn
            small
            depressed
            color="transparent"
            class="opacity_0 mx-3 text-body-1 font-weight-light"
            @click="sortEventListByName();"
          >
            <v-icon
              left
              small
              :color="colorTask"
            >
              folder
            </v-icon>
            <span class="white--text">By Task</span>
          </v-btn>

          <!-- sort by time -->
          <v-btn
            small
            depressed
            color="transparent"
            class="opacity_0 mx-3 text-body-1 font-weight-light"
            @click="sortEventListByTime();"
          >
            <v-icon
              left
              small
              :color="colorTime"
            >
              folder
            </v-icon>
            <span class="white--text">By Time</span>
          </v-btn>
        </v-col>

        <v-col class="d-flex justify-end">
          <v-btn
            small
            depressed
            color="transparent"
            @click="Handler_addEvent();"
          >
            <v-icon class="mx-2" :color="colorAdd">mdi-plus</v-icon>
            <span class="white--text text-body-1 font-weight-light">Add</span>
          </v-btn>

          <v-btn
            small
            depressed
            color="transparent"
            @click="Handler_toggleDeleteButton();"
          >
            <v-icon class="mx-2" :color="colorRemove">mdi-minus</v-icon>
            <span class="white--text text-body-1 font-weight-light">Remove</span>
          </v-btn>
        </v-col>

      </v-row>
    </v-container>

    <v-divider></v-divider>

    <Sidebar_EventEditor
      v-bind:Interface_showSidebar="ChildShowSidebar"
      v-bind:Interface_hideSidebar="ChildHideSidebar"
      v-bind:Interface_setEvent="ChildUpdateEvent"
      v-on:Interface_save="ChildSave"
    />

    <!-- scrollable to display time tab -->
    <v-virtual-scroll :items="eventListDisplay" height="600" item-height="70">

      <template v-slot="{ item }">

        <v-list-item
          dense
          class="event_tag mx-3 py-0"
          :class="item[2]"
        >
          <v-container
            @click="Handler_showEventDetail(item[5]);"
            class="px-0 mx-0 py-0"
          >
            <v-row class="d-flex justify-space-between align-center">

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
                    class="mx-1 my-2 text-body-1 font-weight-light"
                    v-for="(tag, i) in item[3]"
                    :color="item[4][i]"
                    :key="i"
                    >{{ tag }}</v-chip>
                </div>
              </v-col>

              <v-col class="col-1 col-sm-1 col-md-1 d-flex align-end">
                <div v-if="isShowDelete">
                  <v-btn
                    icon
                    @click.stop="Handler_rmEvent(item[5]);"
                  >
                    <v-icon
                      class="mx-1"
                      color="error"
                      plain
                    >
                      delete
                    </v-icon>
                  </v-btn>
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
import { getTaskName, getTotalTime, getPalette, pad } from "@/utility/Utility"
import { registerCallback_Event, addEvent, rmEvent, configEvent } from "@/network/DataServer";
import Sidebar_EventEditor from "@/components/Sidebar_EventEditor";


// Data
const INDEX_TIME      = 0;
const INDEX_TAG_LIST  = 1;


// Local Function
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


function computeStage(timeStart, timeEnd) {
  // get time
  const time_current  = new Date();
  let   time_start    = new Date();
  let   time_end      = new Date();

  time_start.setHours(timeStart[0], timeStart[1]);
  time_end.setHours(timeEnd[0], timeEnd[1]);

  // compute stage based on start and end time
  if (timeStart[0] === timeEnd[0] && timeStart[1] === timeEnd[1]) {
    return "blank";
  }

  if (time_end < time_current)    return "passed";
  if (time_start > time_current)  return "future";
  else                            return "ongoing";
}


// Global Function
export default {
  components: {
    Sidebar_EventEditor
  },

  data: () => ({
    // statistic
    textTimeTotal: 0,

    eventListDisplay: [],
    eventList: [],

    // sortedBy
    // 1: time
    // 2: name
    sortedBy: 1,
    lockSorting: false,

    colorTask: "grey",
    colorTime: "grey",
    colorAdd: "green",
    colorRemove: "white",

    // show
    isShowDelete: false,

    // interface
    // InterfaceToggleSidebar: false,
    ChildShowSidebar: false,
    ChildHideSidebar: false,
    ChildUpdateEvent: []
  }),

  computed: {
  },

  methods: {
    updateEventList(data) {
      // ----- eventList -----
      this.eventList = data;

      // ----- eventListDisplay -----
      // remove old item
      while (this.eventListDisplay.length > 0) this.eventListDisplay.pop();

      // add new item
      for (let i = 0; i < this.eventList.length; i++) {
        const event        = this.eventList[i];
        const eventDisplay = [];

        // task name
        eventDisplay.push(getTaskName(event[INDEX_TAG_LIST]));

        // time
        eventDisplay.push(
          pad(event[INDEX_TIME][0], 2) + ':' + pad(event[INDEX_TIME][1], 2) +
          " - " +
          pad(event[INDEX_TIME][2], 2) + ':' + pad(event[INDEX_TIME][3], 2)
        );

        // stage
        eventDisplay.push(computeStage(
          [event[INDEX_TIME][0], event[INDEX_TIME][1]],
          [event[INDEX_TIME][2], event[INDEX_TIME][3]]
        ));

        // tag and tag color
        // for display in timetable, tag with special character at the beginning will be ignored
        const event_list = [];
        const event_color_list = [];
        for (let index_tag = 0; index_tag < event[INDEX_TAG_LIST].length; index_tag++) {
          const tag = event[INDEX_TAG_LIST][index_tag];
          if (tag.length == 0) continue;
          if (tag[0] === '*' || tag[0] === '*') continue;

          event_list.push(tag);
          event_color_list.push(getPalette(tag));
        }

        eventDisplay.push(event_list);
        eventDisplay.push(event_color_list);

        // the ground truth index
        eventDisplay.push(i);

        // add to eventList
        this.eventListDisplay.push(eventDisplay);
      }

      // ----- total time -----
      let timeList = [];
      for (const item of this.eventList) {
        timeList.push(item[INDEX_TIME]);
      }

      const time_total     = getTotalTime(timeList);
      this.textTimeTotal   = time_total.toFixed(2);

      //  ----- sort -----
      if (this.sortedBy === 1) this.sortEventListByTime();
      else                     this.sortEventListByName();
    },

    sortEventListByTime() {
      // lock
      if (this.lockSorting) return;
      this.lockSorting = true;

      // actual sorting
      this.eventListDisplay.sort(compareEventTime);
      this.sortedBy = 1;
      this.setTagColor();

      // lock
      this.lockSorting = false;
    },

    sortEventListByName() {
      // lock
      if (this.lockSorting) return;
      this.lockSorting = true;

      // actual sorting
      this.eventListDisplay.sort(compareEventName);
      this.sortedBy = 2;
      this.setTagColor();

      // lock
      this.lockSorting = false;
    },

    setTagColor() {
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

    enableSidebar(index) {
      // format
      // - task name
      // - time
      // - tag list
      // - state
      let data;

      // if index < 0, then it is the "add" state instead of "config" state
      // ----- add state -----
      if (index < 0) {
        // get current time
        const today = new Date();

        // set data
        data = [
          [today.getHours(), today.getMinutes(), today.getHours(), today.getMinutes()],
          [],
          -1,
          0
        ]
      }

      // ----- config state -----
      else {
        data = [
          Array.from(this.eventList[index][INDEX_TIME]),
          Array.from(this.eventList[index][INDEX_TAG_LIST]),
          index,
          1
        ]
      }

      this.ChildUpdateEvent = Array.from(data);

      // show the sidebar
      this.ChildShowSidebar = !this.ChildShowSidebar;
    },

    Handler_addEvent() {
      this.enableSidebar(-1);
    },

    Handler_toggleDeleteButton() {
      if (this.isShowDelete) {
        this.isShowDelete = false;
        this.colorRemove = "white";

      } else {
        this.isShowDelete = true;
        this.colorRemove = "red";
      }
    },

    Handler_rmEvent(index) {
      const today = new Date();
      rmEvent([today.getFullYear(), today.getMonth() + 1, today.getDate()], index);
    },

    Handler_showEventDetail(index) {
      this.enableSidebar(index);
    },

    ChildSave(data) {
      // get today date
      const today = new Date();
      const date = [today.getFullYear(), today.getMonth() + 1, today.getDate()];

      // send request to server
      switch (data[3]) {
        // add
        case 0:
          addEvent(date, data[0].slice(0, 2), data[0].slice(2, 4), data[1]);
          break;

        // config
        case 1:
          configEvent(date, data[2], data[0].slice(0, 2), data[0].slice(2, 4), data[1]);
          break;
      }
    }
  },

  mounted() {
    const today = new Date();
    registerCallback_Event(
      [today.getFullYear(), today.getMonth() + 1, today.getDate()],
      this.updateEventList
    );
  },

  updated() {
  }
};
</script>


<style scoped>
.passed {
  border-left: 4px solid #3cd1c2;
}
.ongoing {
  border-left: 4px solid lightgreen;
}
.blank {
  border-left: 4px solid yellow;
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
