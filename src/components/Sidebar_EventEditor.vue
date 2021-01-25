<template>
  <v-navigation-drawer
    class="opacity_1 no_select"
    v-model="sidebar"
    width="400"
    absolute
    right
  >

    <!-- save, load -->
    <template class="mx-0 px-0">
      <v-container class="mx-0 px-0 d-flex justify-start">
        <v-row class="d-flex justify-start">

          <v-col>
            <v-btn
              class="button_0 mx-3 error--text text-h6"
              color="transparent"
              elevation="0"
              @click="Handler_close();"
            >
              Close
            </v-btn>

            <v-btn
              class="mx-3 green--text text-h6"
              color="transparent"
              elevation="0"
              :disabled="!isSaveButtonEnabled"
              @click="Handler_save();"
            >
              Save
            </v-btn>
          </v-col>

        </v-row>
      </v-container>
    </template>

    <div class="my-6"></div>

    <v-list>
      <v-list-item>
        <div class="justify-start">
          <p class="white--text text-body-2 font-weight-light">Task</p>
          <p class="white--text text-h4 font-weight-light">{{ textTask }}</p>
        </div>
      </v-list-item>

      <v-list-item>
      </v-list-item>

      <!-- time -->
      <v-list-item>
        <v-container>

          <v-row>
            <p class="white--text text-body-2 font-weight-light">Time</p>
          </v-row>

          <v-row class="align-center">

            <v-col>
              <v-text-field
                class="text_field_error text-input-white text-h4 font-weight-light"
                dark
                v-model="textTimeStart"
                :rules="[rules.time]"
                maxlength="5"
                requried
                @input="updateSaveButton();"
              >
              </v-text-field>
            </v-col>
            <p
              style="text-align: center; display: inline-block;"
              class="mx-2 px-2 white--text text-h4 font-weight-light"
            >
              to
            </p>
            <v-col>
              <v-text-field
                class="text_field_error text-input-white text-h4 font-weight-light"
                dark
                v-model="textTimeEnd"
                :rules="[rules.time]"
                maxlength="5"
                requried
                @input="updateSaveButton();"
              >
              </v-text-field>
            </v-col>

          </v-row>
        </v-container>
      </v-list-item>

      <v-list-item>
      </v-list-item>

      <!-- tag -->
      <v-list-item>
        <v-container>

          <v-row class="my-0">
            <v-col class="px-0 my-0 py-0">
              <div class="white--text text-body-2 font-weight-light">Tag</div>
            </v-col>
          </v-row>

          <v-row class="my-0">
            <v-col class="px-0 my-0 py-0">
              <v-form
                ref="formTag"
                v-model="isInputValidTag"
              >
                <v-text-field
                  class="text_field_error my-0 py-0 text-input-white text-body-1 font-weight-light"
                  dark
                  clearable
                  v-model="textTag"
                  :rules="[rules.nonEmptyString, rules.nonSpaceString]"
                  @keyup.enter.prevent="Handler_addTag();"
                >
                </v-text-field>
                <v-text-field class="tool_hide"></v-text-field>
              </v-form>
            </v-col>

            <v-col class="px-0 my-0 py-0 d-row justify-end">
              <v-btn
                class="button_0"
                color="transparent"
                elevation="0"
                @click="Handler_addTag();"
              >
                <v-icon color="white" small>mdi-plus</v-icon>
                <div class="mx-3 white--text text-body-2 font-weight-light">Add Tag</div>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="mx-0 px-0">
              <v-chip
                dark
                class="mx-1 my-2 px-1 text-body-1 font-weight-light"
                v-for="(tag, i) in eventTag"
                :color="eventColor[i]"
              >
                <div class="mx-1">{{ tag }}</div>
                <v-btn
                  icon
                  class="mx-0 px-0"
                  @click="Handler_closeTag(i);"
                >
                  <v-icon small>mdi-close</v-icon>
                </v-btn>
              </v-chip>
            </v-col>
          </v-row>

        </v-container>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>
</template>


<script>
import { getTaskName, getPalette } from "@/utility/Utility"


// Local Function
function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}


// Global Function
export default {
  name: "Sidebar_EventEditor",

  data: () => ({
    sidebar: false,

    // data required
    // - task name
    // - time
    // - tag list
    eventTag: [],
    eventColor: [],

    // input
    textTask: "None",
    textTimeStart: "00:00",
    textTimeEnd: "00:00",
    textTag: "",

    isInputValidTag: false,

    // widget enable / disable
    isSaveButtonEnabled: false,

    // rules
    rules: {
      time: value => {
        const pattern = /[0-2][0-9]:[0-5][0-9]/;
        return pattern.test(value) || "Time format invalid";
      },

      nonEmptyString: value => {
        const pattern = /.+/
        return pattern.test(value) || "Name should not be empty";
      },

      nonSpaceString: value => {
        const pattern = /[ ,]/;
        return !pattern.test(value) || "Name should not contain empty space or comma";
      }
    }
  }),

  props: [
    "Interface_showSidebar",
    "Interface_hideSidebar",
    "Interface_setEvent"
  ],

  methods: {
    toggleSidebar() {
      this.sidebar = !this.sidebar;
    },

    showSidebar() {
      // reset text field (tag)
      this.textTag = "";

      // show sidebar
      this.sidebar = true;
    },

    hideSidebar() {
      this.sidebar = false;
    },

    setEvent(eventData) {
      // eventData
      // - time
      // - tag list
      // - event index
      // - edit state

      // time
      this.textTimeStart = pad(eventData[0][0], 2) + ':' + pad(eventData[0][1], 2);
      this.textTimeEnd   = pad(eventData[0][2], 2) + ':' + pad(eventData[0][3], 2);

      // tag list
      while (this.eventTag.length > 0) this.eventTag.pop();
      for (let i = 0; i < eventData[1].length; i++) {
        this.eventTag.push(eventData[1][i]);
      }

      // tag color
      while (this.eventColor.length > 0) this.eventColor.pop();
      for (let i = 0; i < eventData[1].length; i++) {
        this.eventColor.push(getPalette(eventData[1][i]));
      }

      // event index
      this.eventIndex = eventData[2];

      // state
      this.editState = eventData[3];

      // task name
      this.textTask = getTaskName(this.eventTag);

      // update
      this.updateSaveButton();
    },

    pushEvent() {
      // compute time_list
      const timeList = [
        parseInt(this.textTimeStart.slice(0, 2)),
        parseInt(this.textTimeStart.slice(3, 5)),
        parseInt(this.textTimeEnd.slice(0, 2)),
        parseInt(this.textTimeEnd.slice(3, 5))
      ];

      // pack data
      // - time
      // - tag
      // - state (add / config)
      const data = [
        timeList,
        this.eventTag,
        this.eventIndex,
        this.editState
      ];

      // emit signal
      this.$emit("Interface_save", data);
    },

    updateTaskName() {
      this.textTask = getTaskName(this.eventTag);
    },

    updateSaveButton() {
      // first disable the save button
      this.isSaveButtonEnabled = false;

      // time -format
      const pattern_time = /[0-2][0-9]:[0-5][0-9]/;
      if (!pattern_time.test(this.textTimeStart)) return;
      if (!pattern_time.test(this.textTimeEnd))   return;

      // time - start before or same as end
      if (this.textTimeStart > this.textTimeEnd) return;

      // tag - tag must not be empty
      if (this.eventTag.length == 0) return;

      // all condition checked
      // re-enable the save button
      this.isSaveButtonEnabled = true;
    },

    Handler_close() {
      this.hideSidebar();
    },

    Handler_save() {
      // push event to parent
      this.pushEvent();

      // hide
      this.hideSidebar();
    },

    Handler_closeTag(index) {
      // remove tag
      this.eventTag.splice(index, 1);
      this.eventColor.splice(index, 1);

      // update
      this.updateTaskName();
      this.updateSaveButton();
    },

    Handler_addTag() {
      // check if valid or not
      // this.textTag will be null if the form is reset
      // therefore checking null is needed
      if (!this.isInputValidTag || this.textTag == null) {
        this.$refs.formTag.reset();
        return;
      }

      // check if tag exist in the list or not
      const tag = this.textTag;
      if (this.eventTag.find(item => item === tag)) {
        this.$refs.formTag.reset();
        return;
      }

      // add tag
      this.eventTag.push(tag);
      this.eventColor.push(getPalette(tag));

      // reset text field
      this.textTag = "";
      this.$refs.formTag.reset();

      // update
      this.updateTaskName();
      this.updateSaveButton();
    }
  },

  watch: {
    // Interface_toggleSidebar: function(newVal, oldVal) {
    //   this.toggleSidebar();
    // },

    Interface_showSidebar: function(newVal, oldVal) {
      this.showSidebar();
    },

    Interface_hideSidebar: function(newVal, oldVal) {
      this.hideSidebar();
    },

    Interface_setEvent: function(newVal, oldVal) {
      this.setEvent(newVal);
    }
  }
};
</script>


<style scoped>
.opacity_0 {
  background: rgba(0, 0, 0, 0);
  /*backdrop-filter: blur(4px);*/
}

.opacity_1 {
  background: rgba(100, 110, 120, 0.3);
  backdrop-filter: blur(4px);
}

.position_abs {
  position: absolute;
}

.button_0:hover {
  background: rgba(0, 0, 0, 0);
}

/*reference*/
/*https://stackoverflow.com/questions/55076861/vuetify-how-to-change-color-on-error-state-in-input*/
.text_field_error >>> .error--text {
  font-weight: normal;
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

/*Example of using hide*/
/*https://forum.framework7.io/t/vue-pressing-enter-key-in-input-causes-app-to-reload/2585/10*/
.tool_hide {
  display: none;
}
</style>
