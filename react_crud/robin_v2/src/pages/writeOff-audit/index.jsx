import { Tabs } from "antd";
import { tabList } from "./config";
const { TabPane } = Tabs;

export default function Index() {
  function callback(key) {
    console.log(key);
  }
  return (
    // type="card"
    <Tabs defaultActiveKey="1" onChange={callback}>
      {tabList.map(item => {
        return (
          <TabPane tab={item.label} key={item.value}>
            <item.content currentTab={item.value}></item.content>
          </TabPane>
        );
      })}
    </Tabs>
  );
}
