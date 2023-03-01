import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { Tabs } from "antd";
import { tabList } from "./config";
const { TabPane } = Tabs;

// 供应商-价格管理
export default function Index() {
  const [activeKey, setActiveKey] = useState("1");

  function callback(key) {
    setActiveKey(key);
    // 切换 清空url查询参数
    // react-router 命令式切换路由  以编程的方式导航
    // useNavigate https://reactrouter.com/docs/en/v6/getting-started/tutorial#navigating-programmatically
    // 解析查询参数 useSearchParams https://reactrouter.com/docs/en/v6/getting-started/tutorial#search-params
  }
  return (
    <Tabs activeKey={activeKey} defaultActiveKey="1" onChange={callback} destroyInactiveTabPane={true}>
      {tabList.map((item) => {
        return (
          <TabPane tab={item.label} key={item.value}>
            <item.content></item.content>
          </TabPane>
        );
      })}
    </Tabs>
  );
}
