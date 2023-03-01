import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

// "homepage": "/build/",
// import reportWebVitals from "./reportWebVitals";
// eslint-disable-next-line
// __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
// eslint-disable-next-line
if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
function render(props) {
  console.log("来自主应用 props:", props);
  window.localStorage.setItem("loginPhone", props.loginPhone);
  console.log("props.loginPhone", props.loginPhone);
  const { container } = props;
  ReactDOM.render(
    // <App />,
    <Suspense fallback={<span>loading</span>}>{<App />}</Suspense>,
    container ? container.querySelector("#root") : document.querySelector("#root")
  );
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

export async function bootstrap() {
  // console.log("[rebuild-robin] react app bootstraped");
}

export async function mount(props) {
  console.log("[rebuild-robin] props from main framework mount", props);
  props.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log("子应用 state, prev", state, prev);
  });
  render(props);
}

export async function unmount(props) {
  // console.log("[rebuild-robin] props from main framework unmount");
  const { container } = props;
  ReactDOM.unmountComponentAtNode(container ? container.querySelector("#root") : document.querySelector("#root"));
}

// 步骤二：设置 history 模式路由的 base：

// <BrowserRouter basename={window.__POWERED_BY_QIANKUN__ ? '/app-react' : '/'}></BrowserRouter>

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
