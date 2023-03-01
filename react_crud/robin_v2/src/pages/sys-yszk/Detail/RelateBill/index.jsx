import React from "react";

import { Drawer, Tabs } from "antd";
import Settle from "./Settle";
import WriteOff from "./WriteOff";
const { TabPane } = Tabs;

// 供应商-价格管理
export default function Index(props) {
  console.log("props", props);
  return (
    <Drawer
      title={`${props?.record?.billNo}`}
      placement="right"
      onClose={props.onClose}
      visible={props.visible}
      // closable={false}
      destroyOnClose={true}
      width={1000}
      bodyStyle={{ padding: 0 }}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab={"结算订单"} key={1}>
          <Settle record={props?.record} />
        </TabPane>
        <TabPane tab={"销账订单"} key={2}>
          <WriteOff record={props?.record} />
        </TabPane>
      </Tabs>
    </Drawer>
  );
}
