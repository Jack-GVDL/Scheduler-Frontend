<template>
  <v-card>
    <v-toolbar tile dark flat color="blue-grey darken-3">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" app dark color="blue-grey darken-4">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <!-- divider -->
      <v-divider></v-divider>

      <!-- action list -->
      <v-list>
        <v-list-item
          @click.stop="
            openDialog
          "
        >
          <v-list-item-icon>
            <v-icon>fiber_new</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Log Task</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <!-- <v-list nav>
				<v-list-item v-for="(item, i) in actionitems" :key="i" router :to="item.route">
					<v-list-item-icon>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>{{ item.text }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list> -->

      <!-- divider -->
      <v-divider></v-divider>

      <v-list nav>
        <v-list-item
          v-for="(item, i) in viewList"
          :key="i"
          router
          :to="item.route"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- dialog: log task -->
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title>Log Task</v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-container>

              <v-row>
                <v-col>
                  <v-text-field v-model="tag" label="Task*" required></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field v-model="timeStart" type="time" label="Start time*" required>
                  </v-text-field>
                </v-col>

                <v-col>
                  <v-text-field v-model="timeEnd" type="time" label="Stop time*" required>
                  </v-text-field>
                </v-col>
              </v-row>

<!--              <v-row>-->
<!--                <v-col>-->
<!--                  <v-autocomplete-->
<!--                    :items="['Ongoing', 'Complete', 'Overdue']"-->
<!--                    label="Stage"-->
<!--                  >-->
<!--                  </v-autocomplete>-->
<!--                </v-col>-->

<!--                <v-col>-->
<!--                  <v-autocomplete-->
<!--                    :items="['Study', 'Work', 'Rest', 'Other']"-->
<!--                    label="Tag"-->
<!--                    multiple-->
<!--                  >-->
<!--                  </v-autocomplete>-->
<!--                </v-col>-->
<!--              </v-row>-->

            </v-container>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeDialog()">
            Close
          </v-btn>
          <v-btn color="green darken-1" text @click="saveDialog()">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>


<script>
import {addEvent} from "@/network/dataServer"


// Local Function
// https://stackoverflow.com/questions/2998784/how-to-output-numbers-with-leading-zeros-in-javascript
function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num
}


// Global Function
export default {
  data: () => ({
    actionList: [{ icon: "fiber_new", text: "New Task", route: "/addTask" }],
    viewList: [
      { icon: "view_list", text: "Overview", route: "/profile" },
      // {icon: "analytics", 		text: "Analyze",	route: "/analyze"},
      { icon: "calendar_today", text: "Schedule", route: "/schedule" }
    ],

    tag:        "",
    timeStart:  "",
    timeEnd:    "",

    drawer: false,
    dialog: false
  }),

  methods: {
    openDialog() {
      // get current time
      // then do rounding
      const today = new Date();
      let hour    = today.getHours();
      let minute  = today.getMinutes();

      if (minute % 10 < 5)  minute  = minute - (minute % 10);
      else                  minute  = minute + (10 - minute % 10);

      if (minute >= 60) {
        minute = 0;
        hour++;
      }

      // time to string
      const timeString = pad(hour, 2) + ":" + pad(minute, 2);

      // reset form
      // try {
      //   this.$refs.form.reset();
      // } catch {}

      // reset data
      this.tag        = ""
      this.timeStart  = timeString
      this.timeEnd    = timeString

      // show dialog
      this.dialog = true;
    },

    closeDialog() {
      this.dialog = false;
    },

    saveDialog() {
      // hide dialog
      this.dialog = false;

      // get today date
      // then get timeStart and timeEnd, where both value must be valid
      let timeStart;
      let timeEnd;

      try {
        const startString = this.timeStart.split(":");
        const endString   = this.timeEnd.split(":");

        timeStart = [parseInt(startString[0]), parseInt(startString[1])];
        timeEnd   = [parseInt(endString[0]), parseInt(endString[1])];

      } catch {
        return;
      }

      // tag must be not be empty
      if (this.tag.length === 0) return;

      // add event
      const today = new Date();
      addEvent(
        [today.getFullYear(), today.getMonth() + 1, today.getDate()],
        timeStart, timeEnd,
        this.tag);
    }
  }
};
</script>
