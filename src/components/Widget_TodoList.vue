<template>
	<v-card
		flat
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

				<v-col class="d-flex justify-start">
					<v-btn
						small
						depressed
						color="transparent"
						@click="Handler_addTodo();"
					>
						<v-icon class="mx-2" color="green">mdi-plus</v-icon>
						<span class="white--text text-body-1 font-weight-light">Add</span>
					</v-btn>

					<v-btn
						small
						depressed
						color="transparent"
						@click="Handler_toggleDeleteButton();"
					>
						<v-icon class="mx-2" :color="color_remove">mdi-minus</v-icon>
						<span class="white--text text-body-1 font-weight-light">Remove</span>
					</v-btn>
				</v-col>

				<v-container>
					<v-row>
						<v-col>

							<!-- list viewer -->
							<v-divider></v-divider>
							<v-virtual-scroll
								:items="todo_list"
								height="600"
								item-height="50"
							>
								<template
									v-slot="{ item }"
								>

									<v-list-item dense>
										<v-container
											class="event_tag"
											@click="Handler_selectTodo(item[0]);"
										>
											<v-row>

												<!-- tag item -->
												<v-col>
													<div class="white--text text-h6 font-weight-light">
														{{ item[1] }}
													</div>
												</v-col>

												<!-- <v-spacer></v-spacer> -->

												<v-col class="d-flex justify-end">
													<v-progress-circular
														color="white"
														:value="20"
													></v-progress-circular>
												</v-col>

												<v-col
													class="col-1"
													style="display: inline-block;"
												>
													<div
														style="display: inline-block;"
														v-show="is_show_delete"
													>
														<v-btn
															icon
															@click.stop="Handler_rmTodo(item[0]);"
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
												<!-- tag item -->

											</v-row>
										</v-container>
									</v-list-item>

								</template>
							</v-virtual-scroll>

						</v-col>
						<v-col>

							<!-- editor -->
							<v-container>

								<!-- title -->
<!--								<v-row>-->
<!--									<div-->
<!--										class="white&#45;&#45;text text-h4 font-weight-light"-->
<!--									>-->
<!--										This is the title-->
<!--									</div>-->
<!--								</v-row>-->

								<!-- name -->
								<v-row class="d-flex align-center">
									<v-col>
										<div class="white--text text-body-2 font-weight-light">
											Name
										</div>
										<v-text-field
											v-model="editor_text_name"
                      @blur="Handler_updateTodo()"
											:rules="[rules.nonEmpty, rules.noSpecialCharacter]"
											class="mx-2 text-input-white text-body-1 font-weight-light"
											dark
										>
										</v-text-field>
									</v-col>
								</v-row>
                <!-- name -->

								<v-row class="my-4">
								</v-row>

								<!-- sub task -->
								<v-row>
									<v-col>

										<div class="white--text text-body-2 font-weight-light">
											Sub-Task
										</div>

										<v-btn
											icon
											plain
											color="white"
											@click="Handler_addSubTask"
										>
											<v-icon>
												mdi-plus
											</v-icon>
										</v-btn>

										<v-list class="opacity_0">

											<v-list-item
												class="my-0 py-0"
												v-for="(item, i) in subtask_list"
											>

												<v-container>
													<v-row class="d-flex justify-start align-start">

<!--														<v-col class="my-0 py-0">-->
<!--															<div class="my-0 py-0 white&#45;&#45;text text-h6 font-weight-light">-->
<!--																{{ item[0] }}-->
<!--															</div>-->
<!--														</v-col>-->

														<!-- subtask - text -->
														<v-text-field
															v-model="item[1]"
                              @blur="Handler_updateSubTask(item[0], item[1], item[2])"
															:rules="[rules.nonEmpty, rules.noSpecialCharacter]"
															class="mx-2 my-0 py-0 text-input-white text-body-1 font-weight-light"
															dark
														>
														</v-text-field>
														<!-- subtask - text -->

														<!-- subtask - checkbox -->
															<v-checkbox
																v-model="item[2]"
                                @blur="Handler_updateSubTask(item[0], item[1], item[2])"
																class="pt-1 my-0"
																dark
																color="white"
															>
															</v-checkbox>
														<!-- subtask - checkbox -->

														<!-- subtask - close -->
														<v-btn
															icon
															dark
															plain
															@click="Handler_rmSubTask(item[0]);"
														>
															<v-icon>
																mdi-close
															</v-icon>
														</v-btn>
														<!-- subtask - close -->

													</v-row>
												</v-container>

											</v-list-item>
										</v-list>

									</v-col>
								</v-row>

								<v-row class="my-2">
								</v-row>

								<!-- text area -->
								<v-row>
									<v-col>

										<div class="white--text text-body-2 font-weight-light">
											Notes
										</div>
										<v-textarea
											v-model="editor_text_note"
											class="text-input-white text-body-1 font-weight-light"
											dark
                      @blur="Handler_updateTodo()"
										></v-textarea>

									</v-col>
								</v-row>
								<!-- text area -->

								<!-- save, close -->
								<v-row>
									<v-col class="d-flex justify-end">
										<v-btn
											class="mx-3 green--text text-h6"
											color="transparent"
											elevation="0"
											:disabled="!is_show_add_button"
											@click="Handler_add();"
                      v-show="is_show_add_button"
										>
											Add
										</v-btn>
									</v-col>
								</v-row>
								<!-- save, close -->

							</v-container>

						</v-col>
					</v-row>
				</v-container>

			</div>
		</div>

	</v-card>
</template>


<script>
import Widget_Base from "@/components/Widget_Base";
import {
  DataServer_addSubTask,
  DataServer_addTodo, DataServer_clearSubTask, DataServer_configSubTask, DataServer_configTodo,
  DataServer_registerCallback_EventList,
  DataServer_registerCallback_TodoList, DataServer_rmSubTask, DataServer_rmTodo,
  DataServer_update_TodoList
} from "@/network/DataServer";


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
		is_minimize: false,

		is_show_delete: false,
		is_show_add_button: true,

		editor_text_name: "",
		editor_text_note: "",
		editor_id_task: -1,

		todo_list: [],
		subtask_list: [],

		color_remove: "red",

		// format: [name, note, [[subtask_name, subtask_done], ...]]
		data_list: [],

		rules: {
			nonEmpty: value => {
				const pattern = /.+/
				return pattern.test(value) || "Name should not be empty";
			},

			noSpecialCharacter: value => {
				const pattern = /[,/;'"]/;
				return !pattern.test(value) || "Name should not contain any special character";
			}
		}
	}),

	methods: {
		// Hook
    // TODO: remove
		// Handler_save() {
		// 	// try to add log whatever if log already existed in control
		// 	DataServer_addTodo(this.editor_text_name, false);
    //
		// 	DataServer_clearSubTask(this.editor_text_name, false);
		// 	for (let i = 0; i < this.subtask_list.length; ++i) {
		// 		DataServer_addSubTask(
		// 			this.editor_text_name,
		// 			this.subtask_list[i][0],
		// 			this.subtask_list[i][1],
		// 			false);
		// 	}
    //
		// 	DataServer_update_TodoList();
		// },

		Handler_toggleDeleteButton() {
			this.is_show_delete = !this.is_show_delete

			if (this.is_show_delete)	this.color_remove = "red";
			else											this.color_remove = "white";
		},

		Handler_addTodo() {
			this.Internal_setEditorTask(-1);
		},

		Handler_rmTodo(id_) {
			// remove the task
			DataServer_rmTodo(-1);

			// check if the target task is in editor
			// if is in editor, then remove from editor (replace it with a new task)
			if (this.editor_id_task !== id_) return;
			this.Internal_setEditorTask(-1);
		},

		Handler_selectTodo(id_) {
			this.Internal_setEditorTask(id_);
		},

    Handler_updateTodo() {
		  DataServer_configTodo(this.id_todo, this.editor_text_name, this.editor_text_note);
    },

		Handler_addSubTask() {
		  DataServer_addSubTask(this.editor_id_task, "", false);
		},

		Handler_rmSubTask(id_) {
		  DataServer_rmSubTask(this.editor_id_task, id_);
		},

    Handler_updateSubTask(id_, name, is_done) {
		  DataServer_configSubTask(this.editor_id_task, id_, name, is_done);
    },

    // TODO: remove
		// Handler_updateEditor() {
		// 	this.Internal_checkEditorUpdate();
		// },

    Handler_add() {

    },

		// hook
		Hook_updateTodoList(data) {
			if (data == null) return;

			// data list
			while (this.data_list.length !== 0) this.data_list.pop();
			for (let i = 0; i < data.length; ++i) {
				this.data_list.push([
					data[i][0],
					data[i][1],
					data[i][2],
					Array.from(data[i][3])
				]);
			}

			// todo list
			while (this.todo_list.length !== 0) this.todo_list.pop();
			for (let i = 0; i < this.data_list.length; ++i) {
			  this.todo_list.push([
			      this.data_list[i][0],
            this.data_list[i][1],
            this.data_list[i][2]
        ]);
      }

			// TODO: test
      console.log(this.data_list);
      console.log(this.todo_list);
		},

		// Internal
		Internal_setEditorTask(id_) {
		  // check if id_ is valid or not
      const index = this.data_list.findIndex(element => element[0] === id_);
      if (index < 0) {
        this.is_show_add_button = true;

        this.editor_task 				= -1;
        this.editor_text_note 	= "";
        this.editor_text_name 	= "";
        while (this.subtask_list.length !== 0) this.subtask_list.pop();
        return;
      }

      this.is_show_add_button = false;

			this.editor_task 				= id_;
      this.editor_text_name 	= this.data_list[index][1];
			this.editor_text_note 	= this.data_list[index][2];

			while (this.subtask_list.length !== 0) this.subtask_list.pop();
			for (let i = 0; i < this.todo_list[index][3].length; ++i) {
				this.subtask_list.push(this.data_list[index][3][i]);
			}
		},

    // TODO: remove
		// check if can save the content in the editor
		// Internal_checkEditorUpdate() {
		// 	// first disable the save button
		// 	this.is_enable_save_button = false;
    //
		// 	// name
		// 	if (this.editor_text_name.length === 0) return;
    //
		// 	// note
		// 	// ...
    //
		// 	// subtask
		// 	// subtask name should not be empty
		// 	for (let i = 0; i < this.subtask_list.length; ++i) {
		// 		const subtask_name = this.subtask_list[i][0];
		// 		if (this.rules.noSpecialCharacter(subtask_name) && this.rules.nonEmpty(subtask_name)) continue;
		// 		return;
		// 	}
    //
		// 	// all condition check
		// 	// enable the save button
		// 	this.is_enable_save_button = true;
		// }
	},

	mounted() {
		// external
		this.hook_close		= this.Interface_hookClose;
		this.data_custom	= this.Interface_custom;

		// parameter
		this.child_widget_base.Interface_custom.push(this);

		// network / server
		DataServer_registerCallback_TodoList(this.Hook_updateTodoList);
		DataServer_update_TodoList(true);
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

.event_tag:hover {
	background-color: rgba(100, 100, 100, 0.2);
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