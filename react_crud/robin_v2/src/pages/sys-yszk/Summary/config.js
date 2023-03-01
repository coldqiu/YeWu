export const list_api = {
  title: "列表接口",
  // url: "/open/charge/channel/queryMsgChannel", // 临时 假数据
  url: "/receivable/querySummaryList",
  method: "post",
  data: {},
};
export const export_api = {
  title: "导出接口",
  url: "/receivable/exportSummary?",
  method: "get",
};
export const buTypeList = [
  { label: "国内短信", value: 1 },
  { label: "国际短信", value: 2 },
  { label: "万数", value: 3 },
];

export const table_columns = [
  {
    title: "消耗月份",
    key: "billMonth",
    width: 110,
    dataIndex: "billMonth",
    search: false,
  },
  {
    title: "消耗月份",
    key: "billMonth",
    width: 110,
    dataIndex: "billMonth",
    hideInTable: true,
    search: {
      transform: (value) => {
        if (value) {
          // console.log("value", value);
          // let tmp = returnDayRange(value);
          return {
            billStartDate: value[0].split("-").join(""),
            billEndDate: value[1].split("-").join(""),
          };
        }
      },
    },
    valueType: "dateRange",
    fieldProps: {
      picker: "month",
      format: "YYYY-MM",
    },
  },
  {
    title: "客户名称",
    key: "customerName",
    width: 110,
    dataIndex: "customerName",
    search: true,
  },
  {
    title: "账号",
    key: "primaryApiAccount",
    width: 110,
    dataIndex: "primaryApiAccount",
    search: true,
    copyable: true,
  },
  {
    title: "操作",
    key: "action",
    dataIndex: "action",
  },
];
