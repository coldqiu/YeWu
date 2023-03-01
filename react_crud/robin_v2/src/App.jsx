import React, { Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { mainRoute } from "@/router";
import { ConfigProvider as AntdConfigProvider, Spin } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import "moment/locale/zh-cn";
import "antd/dist/antd.min.css";
import "@ant-design/pro-table/dist/table.min.css";
import "./App.css";

function App() {
  return (
    <AntdConfigProvider locale={zhCN}>
      <HashRouter basename={window.__POWERED_BY_QIANKUN__ ? "/rebuild" : "/"}>
        <Routes>
          {mainRoute.map((item) => {
            return (
              <Route
                element={<Suspense fallback={<PageLoading />}>{<item.component />}</Suspense>}
                path={item.path}
                key={item.key}
                exact={item.exact || false}
              />
            );
          })}
        </Routes>
      </HashRouter>
    </AntdConfigProvider>
  );
}

export default App;

function PageLoading() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 1000,
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.15)",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "50%",
          right: 0,
          bottom: 0,
          left: "50%",
          zIndex: 1001,
          height: "100%",
        }}
      >
        <Spin size="large"></Spin>
      </div>
    </div>
  );
}
