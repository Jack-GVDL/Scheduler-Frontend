<template>
  <v-navigation-drawer
    class="opacity_1"
    v-model="sidebar"
    width="400"
    absolute
    right
  >

    <v-list>
      <v-list-item>
        <div class="justify-start">
          <p class="white--text text-body-2 font-weight-light">Task</p>
          <p class="white--text text-h4 font-weight-light">{{ eventData[0] }}</p>
        </div>
      </v-list-item>

      <v-list-item>
      </v-list-item>

      <v-list-item>
        <div class="justify-start">
          <p class="white--text text-body-2 font-weight-light">Time</p>
          <p class="white--text text-h4 font-weight-light">{{ eventData[1] }}</p>
        </div>
      </v-list-item>

      <v-list-item>
      </v-list-item>

      <v-list-item>
        <div class="justify-start">
          <p class="white--text text-body-2 font-weight-light">Tag</p>
          <p class="white--text text-h4 font-weight-light">{{ eventData[2] }}</p>
        </div>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>
</template>


<script>
export default {
  name: "Sidebar_EventEditor",

  data: () => ({
    sidebar: false,

    // data required
    // - task name
    // - time
    // - tag list
    eventData: [
      "None",
      "00:00 - 00:00",
      ["tag"]
    ]
  }),

  props: [
    // "Interface_toggleSidebar",
    "Interface_showSidebar",
    "Interface_hideSidebar",
    "Interface_updateEvent"
  ],

  methods: {
    toggleSidebar() {
      this.sidebar = !this.sidebar;
    },

    showSidebar() {
      this.sidebar = true;
    },

    hideSidebar() {
      this.sidebar = false;
    },

    updateEvent(eventData) {
      while (this.eventData.length > 0) this.eventData.pop();
      for (let i = 0; i < eventData.length; i++) {
        this.eventData.push(eventData[i]);
      }
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

    Interface_updateEvent: function(newVal, oldVal) {
      this.updateEvent(newVal);
    }
  }
};
</script>


<style scoped>
.opacity_1 {
  background: rgba(100, 110, 120, 0.3);
  backdrop-filter: blur(4px);
}
</style>
