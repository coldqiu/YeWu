export const Rules = [
  {
    name: "_isParentChecked",
    desc: "该操作仅针同一发货单号下所有商品",
    expression: ({ child, parent }) => {
      // 返回false 命中
      let is = true;
      if (child.checked && !parent.checked) {
        // 不自动取消勾选
        // for (let item of parent.send_items) {
        //   item.checked = false;
        // }
        // parent.checked = false;
        is = false;
      }
      return is;
    },
    message: (title) => {
      return `${title}：操作仅针同一发货单号下所有商品`;
    },
    // 下面三个是提示框的三个配置字段
    title: "",
    type: "",
    duration: 3000,
    // beforeNotify: () => {} 返回 boolean 值
    // beforeNotify, we can stop Notify by changing isCheck, so the process can keep on after rule
  },
  {
    name: "_isParentStatusOne",
    desc: "只能处理待审核的发货单，有一个子单是待审核，整个发货单就是待审核",
    expression: ({ child, parent }, checkedList) => {
      // 返回false 命中
      let is = false;
      for (let item of parent.send_items)
        if (item.outstkFlag === 1) {
          is = true;
        }
      return is;
    },
    message: (title) => {
      return `${title}:只能处理待审核的发货单`;
    },
    title: "",
    type: "",
    duration: 3000,
  },
  {
    name: "_noLockedChild",
    desc: "发货单子单是否有锁定的",
    expression: ({ child, parent }) => {
      // 返回false 命中
      let is = true;
      console.log(" child.lockFlag", child.lockFlag);
      if (child.lockFlag === "T") {
        is = false;
        child.checked = false;
        parent.checked = false;
      }
      return is;
    },
    message: (title) => {
      return `${title}:不能执行，发货单子单有锁定的`;
    },
    title: "",
    type: "",
    duration: 3000,
  },
  {
    name: "_isStatusBetweenOneAndThree",
    desc: "发货子单状态只能为“待审核”、“已审核”、“已发指示”",
    expression: ({ child, parent }) => {
      // 返回false 命中
      let is = true;
      if (child.outstkFlag > 3 || child.outstkFlag < 1) {
        is = false;
        child.checked = false;
        parent.checked = false;
      }
      return is;
    },
    message: (title) => {
      return `${title}:发货子单状态只能为“待审核”、“已审核”、“已发指示”`;
    },
    title: "",
    type: "",
    duration: 3000,
  },
  {
    name: "_isSingleOrder",
    desc: "该操作仅针同一发货单号",
    expression: ({ child, parent }, checkedList) => {
      // 返回false 命中
      let is = true;
      let firstChild = checkedList[0].child;
      if (firstChild.outstkCode !== child.outstkCode) {
        is = false;
        parent.checked = false;
        child.checked = false;
      }
      return is;
    },
    message: (title) => {
      return `${title}:操作仅针同一发货单号`;
    },
    title: "",
    type: "",
    duration: 3000,
  },
  {
    name: "_isSingleOrder",
    desc: "该操作仅针同一发货单号",
    expression: ({ child, parent }, checkedList) => {
      // 返回false 命中
      let is = true;
      let firstChild = checkedList[0].child;
      if (firstChild.outstkCode !== child.outstkCode) {
        is = false;
        parent.checked = false;
        child.checked = false;
      }
      return is;
    },
    message: (title) => {
      return `${title}:操作仅针同一发货单号`;
    },
    title: "",
    type: "",
    duration: 3000,
  },
  {
    name: "_isStatusFour",
    desc: "该操作仅针同一发货单号",
    expression: ({ child, parent }) => {
      // 返回false 命中
      let is = true;
      if (child.outstkFlag !== 4) {
        is = false;
        child.checked = false;
        parent.checked = false;
      }
      return is;
    },
    message: (title) => {
      return `${title}:操作只能处理“已收实绩”的发货单`;
    },
    title: "",
    type: "",
    duration: 3000,
  },
  {
    name: "_isParentStatusTwo",
    desc: "发货单已审核，有子单是已审核",
    expression: ({ child, parent }) => {
      // 返回false 命中
      var has = true;
      // debugger;
      if (child.outstkFlag === 2) {
        // console.log("has", has)
        has = false;
        // child.checked = false;
        parent.checked = false;
        for (let item of parent.send_items) {
          item.checked = false;
        }
      }
      return has;
      // if (child.outstkFlag !== 2) return true
    },
    message: (title) => {
      return `${title}:发货单已审核不能追加，请先锁定发货单再追加`;
    },
    title: "",
    type: "",
    duration: 3000,
  },
  {
    name: "_isSameWarehouse",
    desc: "当前勾选的数据是否是为同一个发货仓库,忽略无仓库的子单",
    expression: ({ child, parent }, checkedList) => {
      // 返回false 命中
      let firstChild; // 第一个有仓库的子单
      for (let item of checkedList) {
        if (item.child.strCode) {
          firstChild = item;
        }
      }
      let is = true;
      if (child.strCode && firstChild.child.strCode !== child.strCode) {
        is = false;
        // child.checked = false;
        // parent.checked = false;
        // for (let item of parent.send_items) {
        //   item.checked = false
        // }
      }
      return is;
    },
    message: (title) => {
      return `${title}:发货单为同一个发货仓库才能批量追加`;
    },
    title: "",
    type: "",
    duration: 3000,
  },
  {
    name: "_isChildStatusBetweenOneAndTwo",
    desc: "发货子单状态只能为“待审核”、“已审核”",
    expression: ({ child, parent }, checkedList) => {
      // 返回false 命中
      let is = true;
      if (child.outstkFlag > 2 || child.outstkFlag < 1) {
        is = false;
        child.checked = false;
        parent.checked = false;
      }
      return is;
    },
    message: (title) => {
      return `${title}:发货子单状态只能为“待审核”、“已审核”。`;
    },
    title: "",
    type: "",
    duration: 3000,
  },
  {
    name: "_isChildLocked",
    desc: "发货子单状态只能为“锁定状态”",
    expression: ({ child, parent }, checkedList) => {
      // 返回false 命中
      let is = true;
      if (child.lockFlag === "F") {
        is = false;
        child.checked = false;
        parent.checked = false;
      }
      return is;
    },
    message: (title) => {
      return `${title}:发货子单状态只能为“锁定状态”。`;
    },
    title: "",
    type: "",
    duration: 3000,
  },
  {
    name: "_hasStrCodeForAppendorders",
    desc: "发货单“无仓库”，不允许追加商品；有一个子单有仓库 就能 追加",
    expression: ({ child, parent }, checkedList) => {
      // 返回false 命中
      let has = false;
      for (let item of parent.send_items) {
        if (item.strCode) {
          has = true;
        }
      }
      child.checked = false;
      parent.checked = false;

      return has;
    },
    message: (title) => {
      return `${title}:发货单“无仓库”；不允许追加商品。`;
    },
    title: "",
    type: "",
    duration: 3000,
  },
  {
    name: "_hasStrCodeForUnlockorders",
    desc: "发货单“无仓库”,不允许解锁",
    expression: ({ child, parent }, checkedList) => {
      // 返回false 命中
      let has = true;
      if (!child.strCode) {
        has = false;
        child.checked = false;
        parent.checked = false;
      }
      return has;
    },
    message: (title) => {
      return `${title}:发货单“无仓库”,不允许解锁`;
    },
    title: "",
    type: "",
    duration: 3000,
  },
  {
    name: "isInventedF",
    desc: "虚拟库存不能解锁",
    expression: ({ child, parent }, checkedList) => {
      // 返回false 命中
      let has = true;
      if (child.inventedFlag === "T") {
        has = false;
        child.checked = false;
        parent.checked = false;
      }
      return has;
    },
    message: (title) => {
      return `${title}:虚拟库存,不允许解锁`;
    },
    title: "",
    type: "",
    duration: 3000,
  },
];
