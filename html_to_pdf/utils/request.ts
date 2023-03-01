// import { Worker, isMainThread, parentPort, workerData } from "worker_threads";

import axios from "axios";

const koaAxios = axios.create({
  baseURL: "http://127.0.0.1:3001/",
  //   baseURL: "/",
  headers: {},
  //   proxy: {
  //     host: "127.0.0.1",
  //     port: 80,
  //   },
});
// 待处理权限问题
koaAxios.interceptors.request.use((config: any) => {
  //
  return config;
});
// 待处理处理报错问题
koaAxios.interceptors.response.use((response: any) => {
  //
  return response;
});

export function request(options: any) {
  //
  return koaAxios.request(options);
}
