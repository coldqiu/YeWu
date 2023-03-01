export const list_api = {
  title: "应收账款-相关订单-结算订单",
  url: "/open/relatedOrders/settle/order",
  method: "post",
  data: {
    buType: "", // 来自列表的buType
    billNoList: "", // 来自列表的business_id【bu为国内国际】；或business_no 【bu为万数】
    billNo: "", // 当bu为国内国际才需要这个字段 输入框里的值，输入框里没有值就传null
    auditStatusList: "", // 来自下拉框, 没有值就传null
    pageNo: "",
    pageSzie: "",
  },
};

// 结算订单 不同bu 审核状态枚举不同
// 审核状态，国内国际（0未审核，1已通过，2未通过），万数（ 0:未审核 1:已审核,2:已驳回 4:未支付 5:已支付 9:成功 10:失败）
export const auditStatusListNation = [
  { label: "未审核", value: 0 },
  { label: "已通过", value: 1 },
  { label: "未通过", value: 2 },
];
// 结算订单-国际-审核状态 buType 2
export const auditStatusListInternal = [
  { label: "未审核", value: 0 },
  { label: "已通过", value: 1 },
  { label: "未通过", value: 2 },
];
// 结算订单-万数-审核状态 buType 3
export const auditStatusListWans = [
  { label: "未审核", value: 0 },
  { label: "已审核", value: 1 },
  { label: "已驳回", value: 2 },
  { label: "未支付", value: 4 },
  { label: "已支付", value: 5 },
  { label: "成功", value: 9 },
  { label: "失败", value: 10 },
];
// 各个bu的审核状态枚举
export const auditStatusConfig = {
  1: auditStatusListNation,
  2: auditStatusListInternal,
  3: auditStatusListWans,
};

// 充值状态，国内国际（0、2：充值失败，1：充值成功，3：未充值）万数(9:成功。11：未充值,其他：失败)
export const rechargeStatusNation = [
  { label: "充值失败", value: 0 },
  { label: "充值失败", value: 2 },
  { label: "充值成功", value: 1 },
  { label: "未充值", value: 3 },
];
export const rechargeStatusInternal = [
  { label: "充值失败", value: 0 },
  { label: "充值失败", value: 2 },
  { label: "充值成功", value: 1 },
  { label: "未充值", value: 3 },
];
export const rechargeStatusWans = [
  { label: "成功", value: 9 },
  { label: "未充值", value: 11 },
  { label: "失败", value: "不是9，也不是11" },
];
export const rechargeStatusConfig = {
  1: rechargeStatusNation,
  2: rechargeStatusInternal,
  3: rechargeStatusWans,
};
// 结算订单
export const column = [
  {
    title: "结算订单编号",
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
    ellipsis: true,
  },
  {
    title: "产品账号",
    key: "platformAccount",
    width: 110,
    dataIndex: "platformAccount",
    search: false, // buType为国内，国际 才显示
    ellipsis: true,
  },
  {
    title: "产品名称",
    key: "productName",
    width: 110,
    dataIndex: "productName",
    search: false,
    ellipsis: true,
  },
  {
    title: "产品单价（元）",
    key: "productPrice",
    width: 120,
    dataIndex: "productPrice",
    search: false,
  },
  {
    title: "打款金额（元）",
    key: "actualMoney",
    width: 120,
    dataIndex: "actualMoney",
    search: false,
  },
  {
    title: "付款方",
    key: "payerName",
    width: 180,
    dataIndex: "payerName",
    search: false,
    ellipsis: true,
  },
  {
    title: "收款账户",
    key: "receiveAccount",
    width: 110,
    dataIndex: "receiveAccount",
    search: false,
    ellipsis: true,
  },
  {
    title: "到账时间",
    key: "payDate",
    width: 160,
    dataIndex: "payDate",
    search: false,
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
    width: 125,
    dataIndex: "applyRemark",
    ellipsis: true,
    search: false,
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
  //   审核状态，国内国际（0未审核/未支付，1已审核，2不通过/支付失败，4已销账），万数（ 0:未审核 1:已通过 2:已驳回 4:未支付 5:已支付 6:支付失败 7:校验通过 8:校验未通过 9:成功 10:失败）
  {
    title: "充值状态",
    key: "rechargeStatus",
    width: 110,
    dataIndex: "rechargeStatus",
    search: false,
  },

  //   国内国际（0：充值失败，1/2：充值成功）万数(9:成功。其他：失败
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
    title: "审核备注", // 国内、国际，结算订单列表不需要  “审核备注”
    key: "auditRemark",
    width: 110,
    dataIndex: "auditRemark",
    search: false,
    ellipsis: true,
  },
];
