<template>
  <div
    v-if="is_show"
    class="opacity_1 no_select"
  >

    <Widget_Base
      v-bind="child_widget_base"
    />
    <div
      v-if="!is_minimize"
    >Hello World</div>

  </div>
</template>


<script>
import Widget_Base from "@/components/Widget_Base";

export default {
  name: "Widget_ReportDaily",

  props: [
    "Interface_hookClose",
    "Interface_custom"
  ],

  components: {
    Widget_Base
  },

  data: () => ({
    // parameter
    child_widget_base: {
      Interface_custom: [],
      Interface_show: true,
      Interface_title: "Daily Report",

      Interface_hookClose: function(item) {
        // internal
        item[0].is_show = false;

        // external
        if (item[0].hook_close != null) item[0].hook_close(item[0].data_custom);
      },

      Interface_hookMinimize: function(item, is_minimize) {
        // internal
        item[0].is_minimize = is_minimize;
      }
    },

    // internal
    is_show: true,
    is_minimize: false,

    // external
    hook_close: null,
    data_custom: null
  }),

  methods: {

  },

  mounted() {
    // external
    this.hook_close = this.Interface_hookClose;
    this.data_custom = this.Interface_custom;

    // parameter
    this.child_widget_base.Interface_custom.push(this);
  }

};
</script>


<style scoped>
.opacity_0 {
  background: rgba(0, 0, 0, 0.0);
}

.opacity_1 {
  background: rgba(100, 115, 130, 0.3);
  backdrop-filter: blur(1px);
}
</style>
