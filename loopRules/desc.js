import { Rules } from "./rules";

export const actionList = [
  {
    url: "checkOrder",
    title: "审核",
    desc: "",
  },
  {
    url: "cancorders",
    title: "取消",
    desc: "",
  },
  // 编辑、取消、锁定、解锁...
];

export const checkOrder_api = {
  url: "checkOrder",
  title: "审核",
  method: "post",
  param: {
    // 参数
    outSideCodes: [], // 参数,取自table里选中的数据，数组表示多选，字段名为outSide
  },
  info: '1、勾选发货单，可多选。2、发货单状态只能为"待审核"且子订单未锁定，3、同一个发货单必须同时审核。',
  rulesName: ["_isParentChecked", "_isParentStatusOne", "_noLockedChild"], // 该操作对数据的要求
  rules: Rules.filter((item) => ["_isParentChecked", "_isParentStatusOne", "_noLockedChild"].includes(item.name)),
  tips: "确认框的提示",
};
export const cancorders_api = {
  url: "cancorders",
  title: "取消",
  method: "post",
  param: {
    outstkCodes: ["qwqwokq123", "qwqwqwe124", "qwereqwq125"],
    // stkCodes: ["stk123", "stk124", "stk125"]
    ids: [],
  },
  info: '1、勾选发货子单，可多选。2、发货单状态只能为"待审核"、”已审核“、"已发指示"',
  rulesName: ["_isStatusBetweenOneAndThree"],
  rules: Rules.filter((item) => ["_isStatusBetweenOneAndThree"].includes(item.name)),
};
// ...

// 为了方便理解, 接口描述对象里的param 中有值，但是使用时需要清空；
// 需要一个深拷贝函数，清空属性上的值
export function collectApiParam(Desc) {
  let param = {};
  for (let item of actionList) {
    let item_api = actionToApi(item.url);
    param[item_api] = deepCloneWithoutValue(Desc[item_api].param, true);
  }
  return param;
}

//生成一个这样的对象 { "chkorders_api": { "outstkCodes": [] },  "cancorders_api": { "outstkCodes": [], "ids": [] }, ....}
