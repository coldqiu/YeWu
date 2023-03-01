import Detail from "./Detail";
import Summary from "./Summary";
import MonthSummary from "./MonthSummary";

export const tabList = [
  {
    label: "应收明细",
    value: 1, //
    content: Detail,
  },
  {
    label: "日余额统计表",
    value: 2, //
    content: Summary,
  },
  {
    label: "月汇总应收数据",
    value: 3,
    content: MonthSummary,
  },
];
// 因为上面的组件写法，已经生了各自的模块作用域
// 希望统一注入 buTypeList 只能以属性的形式

// export const buTypeList = [
//   { label: "国内短信", value: 1 },
//   { label: "国际短信", value: 2 },
//   { label: "万数", value: 3 },
// ];
