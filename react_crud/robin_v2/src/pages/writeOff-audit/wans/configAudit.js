// 审核：列表描述字段
export const columns = [
  {
    title: "客户名称",
    key: "customerName",
    dataIndex: "customerName",
    editable: false
  },
  {
    title: "手机号",
    key: "accountPhone",
    editable: false,
    dataIndex: "accountPhone"
  },
  {
    title: "应还金额",
    key: "unpayedMoney",
    editable: false,
    dataIndex: "unpayedMoney"
  },
  {
    title: "合计还款",
    key: "billMoney",
    editable: false,
    dataIndex: "billMoney"
  },
  {
    title: "未还金额",
    key: "waitPayMoney",
    editable: false,
    dataIndex: "waitPayMoney"
  },
  { title: "", editable: false }
];
// 默认选中“通过”