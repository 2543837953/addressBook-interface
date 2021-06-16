import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import FetchSet from "@/FetchSet";

Vue.config.productionTip = false;
Vue.prototype.$vars=FetchSet;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
