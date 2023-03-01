import { buTypeList } from "../config";

// 列表接口
export const list_api = {
  title: "列表接口",
  // url: "/open/charge/channel/queryMsgChannel", // 临时 假数据
  url: "/open/accountsReceivable/statement/detail",
  method: "post",
  data: {
    param: {
      billNo: "",
      buType: "",
      pageNo: 1, // 固定参数
      pageSize: 1, // 固定参数
    },
    detailParam: {
      buType: "",
      relationOrderId: "", // 取自列表里的id
      pageNo: "",
      pageSize: "",
    },
  },
};
// 结算状态,（0未结清 1已结清）
const settleStatusList = [
  { label: "未结清", value: 0 },
  { label: "已结清", value: 1 },
];

// 销账状态 销账状态, 0：已销账，1：未销账
const writeOffStatusList = [
  { label: "已销账", value: 0 },
  { label: "未销账", value: 1 },
];
// 计费方式，1：成功计费，2:提交计费，3：成功+未知
const feeTypeList = [
  { label: "成功计费", value: 1 },
  { label: "提交计费", value: 2 },
  { label: "成功+未知", value: 3 },
];

export const base_info_columns = [
  {
    title: "业务类型",
    key: "buType",
    width: 110,
    dataIndex: "buType",
    valueType: "select",
    fieldProps: {
      options: buTypeList,
    },
  },
  {
    title: "账单月份",
    key: "billMonth",
    width: 70,
    dataIndex: "billMonth",
  },
  {
    title: "客户名称",
    key: "customerName",
    width: 160,
    ellipsis: true,
    dataIndex: "customerName",
  },
  {
    title: "负责人",
    key: "chargePerson",
    width: 110,
    dataIndex: "chargePerson",
  },
  {
    title: "运维人",
    key: "operationPerson",
    width: 110,
    dataIndex: "operationPerson",
  },
  {
    title: "销售人",
    key: "salePerson",
    width: 110,

    dataIndex: "salePerson",
  },
  {
    title: "应还金额",
    key: "dueAmount",
    width: 110,

    dataIndex: "dueAmount",
  },
  {
    title: "已还金额",
    key: "paidAmount",
    width: 110,
    dataIndex: "paidAmount",
  },
  {
    title: "未还金额",
    key: "unpaidAmount",
    width: 110,
    dataIndex: "unpaidAmount",
  },
  {
    title: "销账金额",
    key: "writeOffAmount",
    width: 110,

    dataIndex: "writeOffAmount",
  },
  {
    title: "结算状态",
    key: "settleStatus",
    width: 80,
    dataIndex: "settleStatus",

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
    valueType: "select",
    fieldProps: {
      options: writeOffStatusList,
    },
  },
];

export const table_columns = [
  {
    title: "账单明细编号",
    key: "billNo",
    width: 150,
    dataIndex: "billNo",
    search: false,
    fixed: "left",
    copyable: true,
    ellipsis: true,
  },
  {
    title: "账单月份",
    key: "billMonth",
    width: 80,
    dataIndex: "billMonth",
    search: false,
  },
  {
    title: "客户名称",
    key: "customerName",
    width: 180,
    ellipsis: true,
    dataIndex: "customerName",
    copyable: true,
    search: false,
  },
  {
    title: "自助通账号",
    key: "accountName",
    width: 110,
    dataIndex: "accountName",
    search: false, // buType为万数 才显示
  },
  {
    title: "api主账号",
    key: "primaryApiAccount",
    width: 110,
    dataIndex: "primaryApiAccount",
    search: false, // buType为国内，国际 才显示
  },
  {
    title: "api子账号",
    key: "apiAccount",
    width: 110,
    dataIndex: "apiAccount",
    search: false, // buType为国内，国际 才显示
  },

  {
    title: "产品名称",
    key: "productName",
    width: 110,
    ellipsis: true,
    dataIndex: "productName",
    search: false,
  },
  {
    title: "月发送数",
    key: "sendCount",
    width: 100,
    dataIndex: "sendCount",
    search: false,
    summaryName: "sendCountSum",
  },
  {
    title: "月成功数",
    key: "successCount",
    width: 100,
    dataIndex: "successCount",
    search: false,
    summaryName: "successCountSum",
  },
  {
    title: "月失败数",
    key: "failCount",
    width: 100,
    dataIndex: "failCount",
    search: false,
    summaryName: "failCountSum",
  },
  {
    title: "月未知数",
    key: "unknownCount",
    width: 90,
    dataIndex: "unknownCount",
    search: false,
    summaryName: "unknownCountSum",
  },
  {
    title: "计费方式",
    key: "feeType",
    width: 90,
    dataIndex: "feeType",
    search: false, // 1：成功计费，2:提交计费，3：成功+未知
    valueType: "select",
    fieldProps: {
      options: feeTypeList,
    },
  },
  {
    title: "应付数量",
    key: "settleCount",
    width: 110,
    dataIndex: "settleCount",
    search: false,
    summaryName: "settleCountSum",
  },
  {
    title: "结算单价",
    key: "settlePrice",
    width: 80,
    dataIndex: "settlePrice",
    search: false,
  },
  {
    title: "应付金额",
    key: "settleAmount",
    width: 110,
    dataIndex: "settleAmount",
    search: false,
    summaryName: "settleAmountSum",
  },
];
