import { momentTime } from "@/utils";
import { orderTypeList, allOrderStatusList } from "@/common/wans/data";
// 列表数据接口
export const list_api = {
  title: "获取列表数据 table",
  url: "/open/trans/biz/offset/list",
  method: "post"
};

// 审核接口
export const audit_api = {
  title: "审核",
  url: "/open/trans/biz/offset/audit",
  method: "post",
  data: {
    id: "",
    updateTime: "",
    billNo: "",
    auditDate: "", // 手动设置 当前时间（审核时间） 时间戳
    auditRemarks: "", // 输入，驳回必填
    payedDate: "", // 组件框 选择时间 默认当前时间
    auditStatus: "" // 审核1 驳回2
  },
  showMessage: true
};

// 列表列描述对象
export const list_table_colunms = [
  {
    key: "billNo",
    dataIndex: "billNo",
    title: "单据编号",
    width: 170,
    copyable: true,
    // ellipsis: true,
    search: true
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
    search: true
  },
  {
    dataIndex: "accountPhone",
    title: "手机号",
    width: 100,
    search: true
  },
  {
    dataIndex: "unpayedMoney",
    title: "应还金额",
    width: 100,
    ellipsis: true,
    search: false
  },
  {
    dataIndex: "addMoney",
    title: "销账金额",
    width: 100,
    ellipsis: true,
    search: false
  },
  {
    dataIndex: "waitPayMoney",
    title: "未还金额",
    width: 100,
    ellipsis: true,
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
    hideInTable: true,
    dataIndex: "auditDate",
    title: "审核时间",
    valueType: "dateRange",
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
    }
  },
  {
    dataIndex: "auditDate",
    title: "审核时间",
    width: 160,
    render: text => {
      return momentTime(text);
    },
    search: false
  },
  {
    dataIndex: "monthlyBillNo",
    title: "账单编号",
    width: 150,
    ellipsis: true,
    search: false
  },
  {
    dataIndex: "applyTime",
    title: "下单时间",
    width: 160,
    render: text => {
      return momentTime(text);
    },
    search: false
  },
  {
    dataIndex: "createUserName",
    width: 80,
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
