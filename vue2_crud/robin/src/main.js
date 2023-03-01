import Vue from "vue";
import App from "./App.vue";
import httpRequest from "@/utils/httpRequest"; // api: https://github.com/axios/axios
import axiosApi from "@/utils/axios";
//qiankun配置
import { registerMicroApps } from "qiankun";

Vue.prototype.$http = httpRequest; // ajax请求方法

Vue.config.productionTip = false;
Vue.prototype.isAuth = isAuth; // 权限方法
Vue.prototype.axiosApi = axiosApi; // 发送请求

new Vue({
  render: (h) => h(App),
}).$mount("#app");


//子应用列表
let entryConfig = {
  development: "http://127.0.0.1:3000",
  stable: "http://172.16.41.94/build/",
  production: "https://xxx", // 生产环境  这个https 坑了自己一次
};
let entry = process.env.VUE_APP_STABLE
  ? entryConfig.stable
  : entryConfig[process.env.NODE_ENV];
console.log("entry", entry);
let apps = [
  {
    name: "rebuild-robin",
    entry: entry,
    container: "#rebuild-robin",
    activeRule: "#/rebuild/",
    props: {
      loginPhone: loginPhone,
    },
  },
];

const lifeCycle = {
  // beforeLoad: [
  //   app => {
  //     console.log("[LifeCycle] before load %c%s", "color: green;", app.name);
  //   }
  // ],
  // beforeMount: [
  //   app => {
  //     console.log("[LifeCycle] before mount %c%s", "color: green;", app.name);
  //   }
  // ],
  // afterUnmount: [
  //   app => {
  //     console.log("[LifeCycle] after unmount %c%s", "color: green;", app.name);
  //   }
  // ]
};
//注册子应用
registerMicroApps(apps, lifeCycle);
