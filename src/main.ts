import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from 'axios';

Vue.config.productionTip = false;

// vue
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");

// test
// axios
// axios({
//   url: "http://localhost:5000/Get_Json",
//   method: "GET"
// }).then(res => {
//   console.log(res)
// });
