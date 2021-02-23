<template>

  <v-card
    v-if="is_show"
    flat
    class="opacity_0 no_select"
  >

    <!-- title, minimize, close -->
    <v-card-title class="white--text text-h2">
      {{ title }}
      <v-spacer></v-spacer>
      <div class="px-4">
        <v-btn
          icon
          @click="Handler_minimize();"
        >
          <v-icon v-if="!is_minimize" color="white">mdi-minus</v-icon>
          <v-icon v-if="is_minimize" color="white">mdi-plus</v-icon>
        </v-btn>

        <v-btn
          icon
          @click="Handler_close();"
        >
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </div>
    </v-card-title>

  </v-card>

</template>


<script>
export default {
  name: "Widget_Base",

  props: [
    "Interface_show",
    "Interface_title",
    "Interface_minimize",
    "Interface_hookClose",
    "Interface_hookMinimize",
    "Interface_custom"
  ],

  data: () => ({
    is_show: true,
    is_minimize: false,
    title: "Unknown",

    hook_close: null,
    hook_minimize: null,

    data_custom: null
  }),

  methods: {
    Handler_close() {
      let is_show = false;
      if (this.hook_close != null) {
      	is_show = this.hook_close(this.data_custom);
			}
      this.is_show = is_show;
    },

    Handler_minimize() {
      this.is_minimize = !this.is_minimize;
      if (this.hook_minimize != null) this.hook_minimize(this.data_custom, this.is_minimize);
    }
  },

  mounted() {
    this.title = this.Interface_title;
    this.is_show = this.Interface_show;
    this.is_minimize = this.Interface_minimize;

    this.hook_close = this.Interface_hookClose;
    this.hook_minimize = this.Interface_hookMinimize;

    this.data_custom = this.Interface_custom;
  },

  watch: {
  }
};
</script>


<style scoped>
</style>
