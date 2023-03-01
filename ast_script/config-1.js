const config = {
  searchFormDesc: [
    {
      label: "审核状态：",
      events: { click: { value: "aduitStatusFn(item.key)", dynamic: false } },
      list: "auditStatusList",
    },
    {
      label: "申请时间：",
      events: { click: { value: "orderTimeBtnFn(item.key)", dynamic: false } },
      list: "orderStartTimeList",
    },
  ],
  searchInputDesc: {
    ":inputValue": "dataForm.billNo",
    ":all-list": "allList",
    ":page": "page",
    ":size": "size",
    ref: "searchInput",
    "@change": "handleFilter",
    "@keyup.enter.native": "getDataList()",
  },
  buttonListDesc: [
    {
      size: "small",
      type: "primary",
      class: "download-btn",
      ":disabled": "imgUrls.length == 0 || imgUrls.length > 50",
      a: {
        attrsMap: {
          "v-if": "imgUrls.length > 0 && imgUrls.length <= 50",
          download: "",
          target: "_self",
          ":href": "url",
        },
        text: "下载附件",
      },
    },
    { size: "small", type: "primary", "@click": "handleAdd(1, '', payoutBtn)", text: "新建 " },
    {
      class: "download-btn",
      type: "primary",
      size: "small",
      ":disabled": "downLoadUrl == ''",
      a: {
        attrsMap: {
          download: "",
          ":href": "downLoadUrl",
          ":style": "{ padding: '5px 0' }",
          "v-if": "downLoadUrl != ''",
        },
        text: "导出",
      },
    },
  ],
  tableDesc: {
    props: {
      ":data": "tableData",
      ":default-sort": "{ prop: 'date', order: 'descending' }",
      "v-loading": "loading",
      style: "width: 100%",
      "max-height": "700",
      border: "",
      ":row-class-name": "tableRowClassName",
      ":header-cell-style": "tableHeaderRowClassName",
      "@selection-change": "handleSelectionChange",
      "@filter-change": "handleFilterPaytype",
    },
    list: [
      { type: "selection", ":selectable": "checkSelectable", width: "55", fixed: "left" },
      {
        prop: "orderMonth",
        label: "所属期间",
        width: "200",
        "v-if": "defaultList.includes('所属期间')",
        chidlren: [
          {
            tag: "el-button",
            attrsMap: { type: "text", "@click": "orderDetail(scope.row)" },
            children: [{ text: "{{ scope.row.orderDate }} ", tokens: [{ "@binding": "scope.row.orderDate" }, " "] }],
          },
        ],
      },
      {
        prop: "serviceSalesmanName",
        label: "请款类别",
        "show-overflow-tooltip": "",
        "v-if": "defaultList.includes('请款类别')",
        ":filters": "payTypeList",
        ":filter-multiple": "false",
        "filter-placement": "bottom",
        width: "100",
        "column-key": "payTypeId",
        chidlren: [
          {
            tag: "span",
            attrsMap: {},
            children: [
              { text: "{{ scope.row.orderPaytypeLabel }}", tokens: [{ "@binding": "scope.row.orderPaytypeLabel" }] },
            ],
          },
        ],
      },
      {
        prop: "orderAmount",
        label: "付款金额",
        "show-overflow-tooltip": "",
        width: "160",
        "v-if": "defaultList.includes('付款金额')",
        chidlren: [
          {
            text: " {{ row.orderAmount | toFixed | percentileMoney }} ",
            tokens: [" ", { "@binding": '_f("percentileMoney")(_f("toFixed")(row.orderAmount))' }, " "],
          },
        ],
      },
      {
        label: "是否开票",
        "show-overflow-tooltip": "",
        "v-if": "defaultList.includes('是否开票')",
        chidlren: [
          {
            tag: "div",
            attrsMap: {},
            children: [
              { tag: "div", attrsMap: { "v-if": "scope.row.orderBilling == 1" }, children: [{ text: "是" }] },
              { tag: "div", attrsMap: { "v-if": "scope.row.orderBilling == 2" }, children: [{ text: "否" }] },
            ],
          },
        ],
      },
      {
        label: "添加时间",
        width: "170",
        "show-overflow-tooltip": "",
        "v-if": "defaultList.includes('添加时间')",
        chidlren: [
          {
            tag: "div",
            attrsMap: { "v-if": "row.createTime" },
            children: [
              {
                text: ' {{ $moment(Number(row.createTime)).format("YYYY-MM-DD HH:mm:ss") }} ',
                tokens: [" ", { "@binding": '$moment(Number(row.createTime)).format("YYYY-MM-DD HH:mm:ss")' }, " "],
              },
            ],
          },
        ],
      },
      {
        label: "附件",
        prop: "imgUrls",
        width: "350",
        "v-if": "defaultList.includes('附件')",
        chidlren: [
          {
            tag: "template",
            attrsMap: { "v-for": "(item, index) in scope.row.imgUrls" },
            children: [
              {
                tag: "img",
                attrsMap: {
                  "v-if": "isImg(item)",
                  ":key": "index",
                  class: "attchment",
                  ":src": "item",
                  "@click": "showImg(item)",
                },
              },
            ],
          },
        ],
      },
      {
        fixed: "right",
        label: "操作",
        width: "180",
        "v-if": "defaultList.includes('操作')",
        chidlren: [
          {
            tag: "el-button",
            attrsMap: {
              "v-if": "row.isAudit == 1",
              "@click": "passagewayAduitFn(row, payoutBtn)",
              type: "text",
              size: "small",
            },
            children: [{ text: "审核 " }],
          },
          {
            tag: "el-button",
            attrsMap: { "@click": "supplierDetailsFn(row, payoutBtn)", type: "text", size: "small" },
            children: [{ text: "详情 " }],
          },
          {
            tag: "template",
            attrsMap: { "v-if": "row.orderStatus == 2" },
            children: [
              {
                tag: "el-button",
                attrsMap: {
                  "@click": "handlePay(row, payoutBtn)",
                  type: "text",
                  size: "small",
                  ":disabled": "row.isPayed == 1",
                },
                children: [{ text: "付款 " }],
              },
            ],
          },
          {
            tag: "el-button",
            attrsMap: {
              type: "text",
              size: "small",
              "@click": "handelSupple(row)",
              "v-if": "row.orderStatus == 1",
              ":disabled": "row.imgUrls.length >= 10",
            },
            children: [{ text: " 补充附件 " }],
          },
          {
            tag: "el-button",
            attrsMap: {
              "@click": "handleAdd(2, row, payoutBtn)",
              type: "text",
              size: "small",
              "v-if": "row.orderAuditLevel == '1'",
            },
            children: [{ text: "编辑 " }],
          },
          {
            tag: "el-button",
            attrsMap: {
              "@click": "handleDelete(row, payoutBtn)",
              type: "text",
              size: "small",
              "v-if": "row.orderAuditLevel == '1'",
            },
            children: [{ text: "删除 " }],
          },
        ],
      },
    ],
  },
};
