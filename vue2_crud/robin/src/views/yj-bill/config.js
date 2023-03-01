// 列表数据接口
export const list_api = {
  title: "获取列表数据 table",
  url: "/open/monthlybill/customer/debt/listPage",
  method: "post"
};

// table描述对象
export const tableDesc = [
  {
    props: {
      type: "selection"
    }
  },
  {
    props: {
      type: "index",
      label: "序号",
      width: 50,
      align: "center"
    }
  },
  {
    props: {
      prop: "statementNo",
      label: "账单编号",
      width: 250
    }
  },
  {
    props: {
      prop: "customerName",
      label: "客户名称",
      width: 220,
      showOverflowTooltip: true
    }
  },
  {
    props: {
      prop: "month",
      label: "月度"
    }
  },
  {
    props: {
      prop: "buTypeLabel",
      label: "账单类型"
    }
  },
  {
    props: {
      prop: "feeTypeLabel",
      label: "计费方式",
      width: 100
    }
  },
  {
    props: {
      prop: "settleCount",
      label: "结算数"
    }
  },
  {
    props: {
      prop: "payment",
      label: "结算金额",
      align: "right",
      headerAlign: "right"
    }
  },
  {
    props: {
      prop: "createTime",
      label: "生成时间",
      width: 160
    }
  },
  {
    props: {
      prop: "sendStatusLabel",
      label: "发送状态",
      width: 140
    }
  },
  {
    props: {
      prop: "sendTime",
      label: "发送时间",
      width: 160
    }
  },
  {
    isRender: true,
    scope: "action",
    props: {
      prop: "action",
      label: "操作",
      width: 200,
      fixed: "right"
    }
  }
];

export const rules = {
  customerName: [{ max: 50, message: "最多支持50个字符", trigger: "change" }],
  statementNo: [{ max: 50, message: "最多支持50个字符", trigger: "change" }],
  startSettleCount: [
    { max: 20, message: "最多支持20个字符", trigger: "change" }
  ],
  endSettleCount: [{ max: 20, message: "最多支持20个字符", trigger: "change" }],
  startPayment: [{ max: 20, message: "最多支持20个字符", trigger: "change" }],
  endPayment: [{ max: 20, message: "最多支持20个字符", trigger: "change" }]
};
