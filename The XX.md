# high-function

## 背景

业务场景是订单列表页，每个订单都有子单，子单上有多个状态字段，针对订单的操作有十个左右，每个操作对数据的要求都不同，一个操作对应一个接口。

_针对 `table`操作栏的一点改进,在`table`中当数据的层级大于 1,操作项大于 3 时，且每个操作都对数据的状态有一定的要求时，`if-else`就不适了，以下将解释一种处理方法，也许对你有些帮助。_

## 思路

首先冒出来的念头是，要统一这些操作的处理流程。肯定不是用`if-else switch case`这类，从看过一些处理大量`if-else`的文章里汲取营养，链接放在末尾。
统一的处理流程，一个入口函数，一个操作对应一个接口，收集不同接口的参数，判断被勾选的数据是否符合操作的要求，这些处理都必须是适用所有接口的。

**三步走** _描述接口(操作)，收集参数，判断_

## 初始化工作

**操作接口一一对应**

### 描述接口的对象 desc.js

描述操作的 `url method param ` 中文名称，对数据的要求，以及提示信息等等。

**desc.js**文件描述各个接口的信息,以及提供一些数据给页面`index.vue`文件使用；
**rule.js** 集中定义了各个接口对数据的要求，提供给`desc.js`中 接口描述的`rules`配置使用;
**hight-function.js** 定义`loopRules`函数，每条勾选的数据都会执行接口`rules`里的规则，判断数据是否满足当前操作
**index.vue** `param`保存着所有操作的参数描述对象，`key`是接口的`url`，`value`是`param`,`actionStatus`是当前操作的`url`,当前操作的参数`currentParam`

操作一一对应接口`actionList` 给操作栏的`select`组件使用，**这里`url`作为唯一性标识符** _（可以改进）_。url 作为操作的标识，并赋值给`this.actionStatus`,`handleAction`是所有操作的入口，会在在**判断**部分详细说明。

```javascript
export const actionList = [
  {
    url: "checkOrder",
    title: "审核",
    desc: ""
  },
  {
    url: "cancorders",
    title: "取消",
    desc: ""
  },
  ...
  // 编辑、取消、锁定、解锁...
]
```

```javascript
import { Rules } from './rules'

export const checkOrder_api = {
  url: "checkOrder",
  title: "审核",
  method: "post",
  param: { // 参数
    outSideCodes: [] // 参数,取自table里选中的数据，数组表示多选，字段名为outSide
  },
  info: '1、勾选发货单，可多选。2、发货单状态只能为"待审核"且子订单未锁定，3、同一个发货单必须同时审核。',
  rulesName: ["_isParentChecked", "_isParentStatusOne", "_noLockedChild"], // 该操作对数据的要求
  rules: Rules.filter(item => ["_isParentChecked", "_isParentStatusOne", "_noLockedChild"].includes(item.name)),
  tips: '确认框的提示'
};
export const cancorders_api = {
  url: "cancorders",
  title: "取消",
  method: "post",
  param: {
    outstkCodes: ["qwqwokq123", "qwqwqwe124", "qwereqwq125"],
    // stkCodes: ["stk123", "stk124", "stk125"]
    ids: []
  },
  info: '1、勾选发货子单，可多选。2、发货单状态只能为"待审核"、”已审核“、"已发指示"',
  rulesName: ["_isStatusBetweenOneAndThree"],
  rules: Rules.filter(item => ["_isStatusBetweenOneAndThree"].includes(item.name))
};
...

```

```javascript
  // index.vue 收集收集所有操作的参数描述对象，
    import * as Desc from "./desc";

    initParam() {
      this.param = Desc.collectApiParam(Desc);
    },
```

```javascript
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
```

### index.vue

收集 desc.js 中所有操作的参数，以`url`为`key`，参数为`value`， 提供给`index.vue`使用
`index.vue` 里的 `this.param` 后续从勾选的数据筛选参数需要用

```javascript
// index.vue 收集收集所有操作的参数描述对象，
import * as Desc from "./desc";

data() {
  return {
    Dec
  }
},

created() {
  this.initParam();
  this.getTableData();
},

methods: {

    handleAction() {
      // 判断是有 actionStatus和数据,否则什么操作都执行不了
      if (!this._needActionStatusAndData()) return;

      let desc = Desc[Desc.actionToApi(this.actionStatus)];
      // 命中规则不再执行后续
      if (!loopRules(desc, this.checkedList)) return;

      if (this._needMark()) {
        // mark输入和dialog输入 是两个是互斥的
        this.openMarkPrompt();
        return;
      }
      // 使用 this.actionStatus 作为ref 打开不同操作的弹窗
      if (this.$refs[this.actionStatus]) {
        let { child } = this.checkedList[0];
        let currentParams = JSON.parse(JSON.stringify(this.currentParam));
        let row = JSON.parse(JSON.stringify(child));
        let checkedList = JSON.parse(JSON.stringify(this.checkedList));

        this.$refs[this.actionStatus].show("", row, currentParams, checkedList);
        return;
      }
      // 没有需要dialog输入数据 也没有 mark输入 执行提交
      this.submit();
    },

    async getTableData() {
      this.loading = true;
      let { data, err } = await this.axiosApi(Desc.orderLists_api, this.queryPrdlists);
      this.loading = false;
      dealReturn(data, err);

      this.tableData = data.data.data.data; // 这数据层级有点离谱ba
      this.total = parseInt(data.data.data.total);
      this.addPropertyForTableDataItem(); // 添加响应式checked属性

    },
  addPropertyForTableDataItem() {
    for (let item of this.tableData) {
      this.$set(item, "checked", false);
      // 子订单在send_items中
      for (let i of item.send_items) {
        this.$set(i, "checked", false);
      }
    }
  },
  initParam() {
    this.param = Desc.collectApiParam(Desc);
  },
  handleParentCheckBoxChange(row, index, $event) {
    for (let item of row.send_items) {
      item.checked = row.checked;
    }
    this._collectParam(); // 映射，获取数据
  },
  handleChildCheckBoxChange(row, $event) {
    this._checkParentAndChild(row, this.tableData);
    if (!this.actionStatus) {
      return;
    }
    this._collectParam(); // 映射，获取数据
  },
  handleCheckAll() {
    for (let item of this.tableData) {
      item.checked = this.checkedAll;
      for (let i of item.send_items) {
        i.checked = this.checkedAll;
      }
    }
    this._collectParam();
  },
  changeActionStatus() {
    this._collectParam();
  },
  // 接口映射请求字段,
  _collectParam() {
    if (!this.actionStatus) return;

    this.initParam();
    let actionStatusApi = Desc.actionToApi(this.actionStatus);
    let currentParam = this.param[actionStatusApi];
    for (let { child, parent } of this.checkedList) {

      for (let key in currentParam) {
        let endOfS = Array.from(key).slice(-1)[0] === "s" ? true : false;
        if (!child[key] && endOfS) {
          // outskCodes 与 child.outsktCode 和 stkCodes 与child.stkCode
          let keyWithoutS = Array.from(key)
            .slice(0, key.length - 1)
            .join("");
          // console.log("keyWithoutS", keyWithoutS);
          if (
            child[keyWithoutS] &&
            currentParam[key] &&
            currentParam[key].constructor === Array
          ) {
            currentParam[key].push(child[keyWithoutS]);
          } else if (
            !child[key] &&
            child[keyWithoutS] &&
            !currentParam[key]
          ) {
            currentParam[key] = child[keyWithoutS];
          }
        } else {
          currentParam[key] = child[key] ? child[key] : undefined;
        }
      }
    }
    console.log("this.currentParam", this.currentParam);
  },
},

watch: {
    // 用$set()给 this.tableData 的父子订单上都加上了checked属性给checkBox组件使用
     tableData: {
      handler: function (newVal, oldVal) {
        this.checkedList = [];
        let count = 0; // tableData 子单总数
        for (let item of this.tableData) {
          for (let child of item.send_items) {
            count++;
            if (child.checked) {
              this.checkedList.push({
                child: child,
                parent: item,
              });
            }
          }
        }
        this._collectParam();
        if (count === this.checkedList.length && count !== 0) {
          // 这两个变量是给 全选框的
          this.checkedAll = true;
          this.isIndeterminate = false;
        } else if (
          count > this.checkedList.length &&
          this.checkedList.length > 0
        ) {
          this.checkedAll = false;
          this.isIndeterminate = true;
        } else {
          this.checkedAll = false;
          this.isIndeterminate = false;
        }
      },
      deep: true,
    },
}
```

`checkedList`数组保存着勾选的子单数据，`{child: {…}parent: {…}}`, `child`是子单，`parent`是父级订单
