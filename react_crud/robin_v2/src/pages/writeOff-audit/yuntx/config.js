import { orderTypeList, allOrderStatusList } from "@/common/wans/data";
// 列表数据接口
export const list_api = {
  title: "获取列表数据 table",
  url: "/open/trans/biz/offset/list",
  method: "post"
};

// 列表列描述对象
export const list_table_colunms = [
  {
    dataIndex: "billNo",
    title: "单据编号",
    width: 180,
    copyable: true,
    ellipsis: true,
    search: false
  },
  {
    dataIndex: "orderType",
    title: "订单类型",
    width: 80,
    valueType: "select",
    fieldProps: {
      options: orderTypeList
    },
    search: true
  },
  {
    dataIndex: "customerName",
    title: "客户名称",
    width: 180,
    ellipsis: true,
    search: false
  },
  {
    dataIndex: "accountPhone",
    title: "手机号",
    width: 120,
    search: false
  },
  {
    dataIndex: "unpayedMoney",
    title: "应还金额",
    width: 100,
    search: false
  },
  {
    dataIndex: "addMoney",
    title: "销账金额",
    width: 100,
    search: false
  },
  {
    dataIndex: "waitPayMoney",
    title: "未还金额",
    width: 100,
    search: false
  },
  {
    dataIndex: "auditStatus",
    title: "审核状态",
    width: 80,
    valueType: "select",
    fieldProps: {
      options: allOrderStatusList
    },
    search: true
  },
  {
    dataIndex: "auditDate",
    title: "审核时间",
    valueType: "dateRange",
    width: 100,
    fieldProps: {
      placeholder: ["开始时间", "结束时间"]
    },
    search: {
      transform: value => {
        if (value)
          return {
            auditStartTime: value[0],
            auditEndTime: value[1]
          };
      }
    },
    hideInTable: true
  },
  {
    dataIndex: "auditDate",
    title: "审核时间",
    width: 120,
    search: false
  },
  {
    dataIndex: "monthlyBillNo",
    title: "账单编号",
    width: 160,
    ellipsis: true,
    search: false
  },
  {
    dataIndex: "applyTime",
    width: 120,
    title: "下单时间",
    search: false
  },
  {
    dataIndex: "createUserName",
    width: 100,
    title: "申请人",
    search: false
  },
  {
    dataIndex: "applyRemarks",
    width: 100,
    title: "申请备注",
    ellipsis: true,
    search: false
  },
  {
    dataIndex: "auditRemarks",
    title: "审核备注",
    width: 110,
    ellipsis: true,
    search: false
  },
  {
    dataIndex: "option",
    title: "操作",
    valueType: "option",
    width: 80
  }
];
