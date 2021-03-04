<template>
	<div
		v-if="is_show"
		class="opacity_1 no_select"
	>

		<Widget_Base
			v-bind="child_widget_base"
		/>

		<div
			v-show="!is_minimize"
		>
			<div class="mx-6">

			</div>
		</div>

	</div>
</template>


<script>
import Widget_Base from "@/components/Widget_Base";
import { DataServer_registerCallback_EventList } from "@/network/DataServer";


export default {
	name: "Widget_TodoList",

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
			Interface_title: "Todo List",

			Interface_hookClose: (item) => {
				item[0].is_show = false;
				if (item[0].hook_close != null) item[0].hook_close(item[0].data_custom);
			},

			Interface_hookMinimize: (item, is_minimize) => {
				item[0].is_minimize = is_minimize;
			}
		},

		// internal
		is_show: true,
		is_minimize: false
	}),

	mounted() {
		// external
		this.hook_close		= this.Interface_hookClose;
		this.data_custom	= this.Interface_custom;
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

.opacity_4 {
	background: rgba(100, 115, 130, 0.7);
	backdrop-filter: blur(8px);
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