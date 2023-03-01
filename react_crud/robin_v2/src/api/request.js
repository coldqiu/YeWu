import axios from "axios";
import { message } from "antd";
import Cookies from "js-cookie";

// baseURL 待处理
// let baseURL = "http://172.16.41.94:7788/robin"; // stable 环境
// baseURL = window?.env ? window.env.VUE_APP_BASE_API + "/robin" : baseURL;
let baseURL = process.env.REACT_APP_BASE_API + "/robin";
console.log("baseURL", baseURL);

export { baseURL };

export function fixUrl(url) {
  const token = Cookies.get("token");
  return baseURL + url + `&token=${token}`;
}
const axios_robin = axios.create({
  baseURL: baseURL,
});

axios_robin.interceptors.request.use(
  (config) => {
    config.headers = {
      token: Cookies.get("token"),
      timeout: 1000 * 30,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
function getUrl(actionName) {
  return process.env.REACT_APP_BASE_API + "/robin" + actionName;
}
axios_robin.getUrl = getUrl;
axios_robin.interceptors.response.use(
  (response) => {
    // 在各个页面的config.js的接口描述对象里打标记 showMessage
    // showMessage为true时接口成功和失败都提示
    // debugger;
    if (response.config.showMessage) {
      // showMessage
      if (response.data.code === 0) {
        if (response.data.message) message.success(response.data.message);
        if (response.data.msg) message.success(response.data.msg);
      } else {
        if (response.data.message) message.error(response.data.message);
        if (response.data.msg) message.error(response.data.msg);
      }
    } else if (response.data.code !== 0) {
      // showMessage为false时接口失败才提示
      if (response.data.message) message.error(response.data.message);
      if (response.data.msg) message.error(response.data.msg);
      if (response.data.code === 401) {
        console.log("response.data.code 401", response.data.code);
        // 401 token失效 跳转登陆页
        // 临时处理
        let backPath = encodeURIComponent(window.location.href);
        console.log("backPath", backPath);
        setTimeout(() => {
          // window.location.href = `${window.location.origin}/#/login?backPath=${backPath}`;
          window.location.href = `${window.location.origin}/#/login`;
        }, 900);
        // 待实现 子应用 跳转主应用路由
        // 实现参见 微应用之间如何跳转？ https://qiankun.umijs.org/zh/faq#%E5%BE%AE%E5%BA%94%E7%94%A8%E4%B9%8B%E9%97%B4%E5%A6%82%E4%BD%95%E8%B7%B3%E8%BD%AC
      }
    }
    return response.data;
  },
  (error) => {
    message.error(error?.message);
    return Promise.reject(error);
  }
);

// 统一发起请求的函数
export default function request(options) {
  // 列表接口需要处理查询字段处理空字符串
  if (options.data && options.data.query && options.needTrim) {
    for (let key in options.data.query) {
      if (typeof options.data.query[key] === "string" && options.data.query[key].trim() === "") {
        delete options.data.query[key];
      }
    }
  }
  return axios_robin.request(options);
}

// 拼接导出url
export function preFixOutUrl(options) {
  return baseURL + "";
}
