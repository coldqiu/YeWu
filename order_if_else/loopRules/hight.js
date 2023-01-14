import Vue from "vue";

const vue = new Vue();

// 每条勾选的数据处理某个操作的某条规则；
/**
 * checkList中的每条数据都将执行一遍规则
 * @param {*} desc 接口描述对象
 * @param {*} rule 接口上的规则
 * @param {*} checkedList 已经勾选的数据
 */
function baseFun(desc, rule, checkedList) {
  let isCheck = true;
  for (let item of checkedList) {
    // 真实的checkedList数据格式，每条勾选子单都保存了父级 {child: xx, parent: XX}
    if (!rule.expression(item, checkedList)) {
      // 冲突数据 取消勾选
      isCheck = false;
    }
  }
  // beforeNotify, we can stop Notify by changing isCheck, so the process can keep on after rule
  if (rule.beforeNotify) {
    isCheck = rule.beforeNotify(isCheck, rule, desc);
  }
  if (!isCheck) {
    vue.$notify({
      title: rule.title ? rule.title : "提示",
      message: rule.message(desc.title),
      type: rule.type ? rule.type : "warnning",
      duration: rule.duration ? rule.duration : 3000,
    });
    console.log("notify");
    return false; // 命中的规则，退出对loopRules的循环执行；
  }
  return true;
}

/**
 *
 * @param {*} desc 接口描述 使用了title和rules字段
 * @param {*} checkedList 选中数据
 */
export function loopRules(desc, checkedList) {
  // debugger;
  for (let rule of desc.rules) {
    if (!baseFun(desc, rule, checkedList)) {
      // 命中规则 停止执行后续规则
      return false;
    }
  }
  return true;
}
