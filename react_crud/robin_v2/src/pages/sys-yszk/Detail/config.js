// 列表接口
export const list_api = {
  title: "列表接口",
  // url: "/open/charge/channel/queryMsgChannel", // 临时 假数据
  url: "/open/accountsReceivable/statement",
  method: "post",
  data: {},
};

export const buTypeList = [
  { label: "国内短信", value: 1 },
  { label: "国际短信", value: 2 },
  { label: "万数", value: 3 },
];

// 结算状态
export const settleStatusList = [
  { label: "未结清", value: 0 },
  { label: "已结清", value: 1 },
];
// 销账状态，0：已销账，1：未销账
export const writeOffStatusList = [
  { label: "已销账", value: 0 },
  { label: "未销账", value: 1 },
];
// // 计费方式，1：成功计费，2:提交计费，3：成功+未知
// export const feeTypeList = [
//   { label: "成功计费", value: 1 },
//   { label: "提交计费", value: 2 },
//   { label: "成功+未知", value: 3 },
// ];
export const table_columns = [
  {
    title: "账单编号",
    key: "billNo",
    width: 140,
    dataIndex: "billNo",
    search: true,
    copyable: true,
    ellipsis: true,
  },

  {
    title: "业务类型",
    key: "buType",
    width: 80,
    dataIndex: "buType",
    search: true,
    valueType: "select",
    fieldProps: {
      options: buTypeList,
    },
  },
  {
    title: "账单月份",
    key: "billMonth",
    width: 80,
    dataIndex: "billMonth",
    search: false,
  },
  {
    title: "账单月份",
    key: "billMonth",
    width: 80,
    dataIndex: "billMonth",
    hideInTable: true,
    search: {
      transform: (value) => {
        if (value) {
          return {
            billMonth: value.split("-").join(""),
          };
        }
      },
    },
    valueType: "dateMonth",
  },
  {
    title: "客户名称",
    key: "customerName",
    width: 200,
    dataIndex: "customerName",
    ellipsis: true,
    search: true,
  },
  {
    title: "账号",
    key: "accountName",
    width: 110,
    dataIndex: "accountName",
    ellipsis: true,
    search: false,
  },
  {
    title: "负责人",
    key: "chargePerson",
    width: 80,
    dataIndex: "chargePerson",
    search: false,
    ellipsis: true,
  },
  {
    title: "运维人",
    key: "operationPerson",
    width: 80,
    dataIndex: "operationPerson",
    search: false,
  },
  {
    title: "销售人",
    key: "salePerson",
    width: 80,
    search: false,
    dataIndex: "salePerson",
  },
  {
    title: "应还金额",
    key: "dueAmount",
    width: 110,
    search: false,
    dataIndex: "dueAmount",
  },
  {
    title: "已还金额",
    key: "paidAmount",
    width: 110,
    search: false,
    dataIndex: "paidAmount",
  },
  { title: "未还金额", key: "unpaidAmount", width: 110, search: false, dataIndex: "unpaidAmount" },
  {
    title: "销账金额",
    key: "writeOffAmount",
    width: 110,
    search: false,
    dataIndex: "writeOffAmount",
  },
  {
    title: "结算状态",
    key: "settleStatus",
    width: 80,
    dataIndex: "settleStatus",
    search: true,
    valueType: "select",
    fieldProps: {
      options: settleStatusList,
    },
  },
  {
    title: "销账状态",
    key: "writeOffStatus",
    width: 80,
    dataIndex: "writeOffStatus",
    // search: true,
    search: false,
    valueType: "select",
    fieldProps: {
      options: writeOffStatusList,
    },
  },
  {
    dataIndex: "action",
    key: "action",
    title: "操作",
    width: 80,
  },
];
