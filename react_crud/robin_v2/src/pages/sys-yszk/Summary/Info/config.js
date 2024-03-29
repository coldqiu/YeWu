import { buTypeList } from "../config";

// 列表接口
export const list_api = {
  title: "列表接口",
  // url: "/open/charge/channel/queryMsgChannel", // 临时 假数据
  url: "/receivable/querySummaryDetailList",
  method: "post",
  data: {
    summaryIds: [],
  },
};
export const export_api = {
  title: "导出接口",
  url: "/receivable/exportSummaryDetail?",
  method: "post",
};

export const edit_api = {
  title: "编辑备注",
  url: "/receivable/editRemark",
  method: "post",
};

export const table_columns = [
  {
    title: "消耗月份",
    key: "billMonth",
    width: 110,
    dataIndex: "billMonth",
    search: false,
    fixed: "left",
  },
  {
    title: "客户名称",
    key: "customerName",
    width: 200,
    dataIndex: "customerName",
    ellipsis: true,
    search: false,
    fixed: "left",
  },
  {
    title: "账号",
    key: "primaryApiAccount",
    width: 110,
    dataIndex: "primaryApiAccount",
    fixed: "left",
    search: false,
    ellipsis: true,
  },
  {
    title: "产品大类",
    key: "buType",
    ellipsis: true,
    width: 90,
    dataIndex: "buType",
    search: false,
    valueType: "select",
    fieldProps: {
      options: buTypeList,
    },
  },
  {
    title: "产品名称",
    key: "productName",
    width: 110,
    search: false,
    dataIndex: "productName",
    ellipsis: true,
  },
  {
    title: "负责人",
    key: "chargePerson",
    width: 70,
    search: false,
    dataIndex: "chargePerson",
  },
  {
    title: "运维人",
    key: "operationPerson",
    width: 70,
    search: false,
    dataIndex: "operationPerson",
  },
  {
    title: "销售人",
    key: "salePerson",
    width: 70,
    search: false,
    dataIndex: "salePerson",
  },
  {
    title: "期初余额",
    key: "openAmount",
    ellipsis: true,
    width: 90,
    search: false,
    dataIndex: "openAmount",
  },
  {
    title: "本期消耗",
    key: "consumeAmount",
    ellipsis: true,
    width: 90,
    search: false,
    dataIndex: "consumeAmount",
  },
  {
    title: "本期销账",
    key: "writeOffAmount",
    ellipsis: true,
    width: 90,
    search: false,
    dataIndex: "writeOffAmount",
  },
  {
    title: "本期回款",
    key: "returnAmount",
    ellipsis: true,
    width: 90,
    search: false,
    dataIndex: "returnAmount",
  },
  {
    title: "本期结余",
    key: "remainAmount",
    ellipsis: true,
    width: 90,
    search: false,
    dataIndex: "remainAmount",
  },
  {
    title: "销账",
    key: "allWriteOffAmount",
    ellipsis: true,
    width: 90,
    search: false,
    dataIndex: "allWriteOffAmount",
  },
  {
    title: "回款",
    key: "allReturnAmount",
    ellipsis: true,
    width: 90,
    search: false,
    dataIndex: "allReturnAmount",
  },
  {
    title: "期末余额",
    key: "closeAmount",
    ellipsis: true,
    width: 90,
    search: false,
    dataIndex: "closeAmount",
  },
  {
    title: "账龄",
    // key: "accountAge",
    search: false,
    children: [
      {
        title: "0-30 天",
        key: "firstMonthAmount",
        ellipsis: true,
        width: 90,
        search: false,
        dataIndex: "firstMonthAmount",
      },
      {
        title: "31-60 天",
        key: "secondAmount",
        ellipsis: true,
        width: 90,
        search: false,
        dataIndex: "secondAmount",
      },
      {
        title: "61-90 天",
        key: "thirdAmount",
        ellipsis: true,
        width: 90,
        search: false,
        dataIndex: "thirdAmount",
      },
      {
        title: "91-120 天",
        key: "forthAmount",
        ellipsis: true,
        width: 90,
        search: false,
        dataIndex: "forthAmount",
      },
      {
        title: "121-180 天",
        key: "fifthSixthAmount",
        ellipsis: true,
        width: 90,
        search: false,
        dataIndex: "fifthSixthAmount",
      },
      {
        title: "181-360 天",
        key: "seventhTwelfthAmount",
        ellipsis: true,
        width: 90,
        search: false,
        dataIndex: "seventhTwelfthAmount",
      },
      {
        title: "1-2 年",
        key: "secondYearAmount",
        ellipsis: true,
        width: 90,
        search: false,
        dataIndex: "secondYearAmount",
      },
      {
        title: "2-3 年",
        key: "thirdYearAmount",
        ellipsis: true,
        width: 90,
        search: false,
        dataIndex: "thirdYearAmount",
      },
      {
        title: "3年以上",
        key: "aboveThirdYearAmount",
        ellipsis: true,
        width: 90,
        search: false,
        dataIndex: "aboveThirdYearAmount",
      },
    ],
  },
  {
    title: "备注",
    key: "remark",
    width: 110,
    dataIndex: "remark",
    search: false,
    ellipsis: true,
  },
  {
    title: "生成时间",
    key: "createDateStr",
    width: 90,
    dataIndex: "createDateStr",
    search: false,
  },
  {
    title: "生成时间",
    key: "createTime",
    width: 90,
    dataIndex: "createTime",
    hideInTable: true,
    valueType: "dateRange",
    search: {
      transform: (value) => {
        if (value) {
          return {
            createStartDate: value[0].split("-").join(""),
            createEndDate: value[1].split("-").join(""),
          };
        }
      },
    },
  },
  {
    title: "操作",
    key: "action",
    width: 110,
    dataIndex: "action",
    search: false,
  },
];
