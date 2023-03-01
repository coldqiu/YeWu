export const list_api = {
  title: "应收账款-相关订单-销账订单",
  url: "/open/relatedOrders/writeOff/order",
  method: "post",
  data: {
    buType: "", // 来自列表的buType
    billNoList: "", // 来自列表的 writeOffOrderBillNo 或输入框
    auditStatusList: "", // 来自下拉框
    pageNo: "",
    pageSzie: "",
  },
};

// 销账订单 不同bu 审核状态枚举不同
// 审核状态，国内国际:（0未审核，1已通过，2未通过,）,
// 万数（0:未审核 1:已审核，2:已驳回  9:成功 10:失败）
export const auditStatusListNation = [
  { label: "未审核", value: 0 },
  { label: "已通过", value: 1 },
  { label: "未通过", value: 2 },
];
// 结算订单-国际-审核状态
export const auditStatusListInternal = [
  { label: "未审核", value: 0 },
  { label: "已通过", value: 1 },
  { label: "未通过", value: 2 },
];
// 结算订单-万数-审核状态
export const auditStatusListWans = [
  { label: "未审核", value: 0 },
  { label: "已审核", value: 1 },
  { label: "已驳回", value: 2 },
  { label: "成功", value: 9 },
  { label: "失败", value: 10 },
];

// 各个bu的审核状态枚举
export const auditStatusConfig = {
  1: auditStatusListNation,
  2: auditStatusListInternal,
  3: auditStatusListWans,
};

// 0-默认  1-汇率差异  2-手续费）
export const adjustTypeList = [
  { label: "默认", value: 0 },
  { label: "汇率差异", value: 1 },
  { label: "手续费", value: 2 },
];
// 销账类型，国内国际：（0-默认  1-赠送  2-系统错误 3-赔偿）【来自数据 备注，是错误的】，若业务bu为万数，则无该字段

// 销账类型 前端写死的是对的【来自销账 云通讯】
export const writeOffTypeList = [
  { label: "其他", value: 0 }, // 历史数据
  { label: "条数减免", value: 1 },
  { label: "计费方式调整", value: 2 },
  { label: "计费单价调整", value: 3 },
];
// 销账订单
export const column = [
  {
    title: "销账订单编号",
    key: "billNo",
    width: 170,
    dataIndex: "billNo",
    search: true,
    fixed: "left",
    ellipsis: true,
    copyable: true,
  },
  {
    title: "客户名称",
    key: "customerName",
    width: 180,
    dataIndex: "customerName",
    search: false,
    ellipsis: true,
  },
  {
    title: "自助通账号",
    key: "accountName",
    width: 110,
    dataIndex: "accountName",
    search: false, // buType为万数 才显示
  },
  {
    title: "产品账号",
    key: "platformAccount",
    width: 110,
    dataIndex: "platformAccount",
    search: false, // 产品名称，若业务bu为万数，则无该字段
  },
  {
    title: "产品名称", // 产品名称，若业务bu为万数，则无该字段
    key: "productName",
    width: 110,
    dataIndex: "productName",
    search: false,
  },
  {
    title: "销账类型",
    key: "writeOffType",
    width: 110,
    dataIndex: "writeOffType",
    search: false, // buType为国内，国际 才显示
  },
  // 销账类型，国内国际：（0-默认  1-赠送  2-系统错误 3-赔偿），若业务bu为万数，则无该字段
  {
    title: "产品单价（元）",
    key: "productPrice",
    width: 120,
    dataIndex: "productPrice",
    search: false, // 若业务bu为万数，则无该字段
  },
  {
    title: "销账金额（元）",
    key: "writeOffMoney",
    width: 120,
    dataIndex: "writeOffMoney",
    search: false,
  },
  {
    title: "销账凭证",
    key: "filePath",
    width: 110,
    dataIndex: "filePath",
    search: false, // 若业务bu为万数，则无该字段
  },
  {
    title: "调差类型",
    key: "adjustType",
    width: 110,
    dataIndex: "adjustType",
    search: false,
    // 调差类型，国内国际：（0-默认  1-汇率差异  2-手续费），若业务bu为万数，则无该字段
  },
  {
    title: "调差金额（元）",
    key: "adjustMoney",
    width: 120,
    dataIndex: "adjustMoney",
    search: false,
    // 若业务bu为万数，则无该字段
  },
  {
    title: "申请信息",
    key: "applyInformation",
    width: 195,
    dataIndex: "applyInformation",
    search: false,
  },
  {
    title: "申请备注",
    key: "applyRemark",
    width: 110,
    dataIndex: "applyRemark",
    search: false,
    ellipsis: true,
  },
  {
    title: "审核状态",
    key: "auditStatus",
    width: 110,
    dataIndex: "auditStatus",
    search: true,
    valueType: "select",
    fieldsProps: {
      options: [{}], // 不同bu 枚举不同；
    },
  },
  // 审核状态，国内国际:（0未审核/未支付，1已审核，2不通过/支付失败）,万数（:未审核 1:已通过 2:已驳回 7:校验通过 8:校验未通过 9:成功 10:失败）
  // 审核状态，国内国际:（0未审核/未支付，1已审核，2不通过/支付失败,3：展示为空）,万数（:未审核 1:已通过 2:已驳回 7:校验通过 8:校验未通过 9:成功 10:失败，11：展示为空）
  {
    title: "审核信息",
    key: "auditInformation",
    width: 195,
    dataIndex: "auditInformation",
    search: false,
    renderText: (text, record) => {
      if (record.auditInformation === "nullnull") {
        return "";
      } else {
        return record.auditInformation;
      }
    },
  },
  {
    title: "审核备注",
    key: "auditRemark",
    width: 110,
    dataIndex: "auditRemark",
    search: false,
    ellipsis: true,
  },
];
