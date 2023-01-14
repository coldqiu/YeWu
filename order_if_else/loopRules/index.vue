<template>
  <div class="">
    <el-col :span="12" style="text-align: right">
      <el-select clearable v-model="actionStatus" @change="changeActionStatus" placeholder="执行选择项">
        <el-option v-for="item in actionList" :key="item.url" :label="item.title" :value="item.url">
          <template>
            <el-row>
              <el-col :span="21">
                <span>{{ item.title }}</span>
              </el-col>
            </el-row>
            <i class="el-icon-edit"></i>
          </template>
        </el-option>
      </el-select>
      <el-button @click="handleAction" type="primary">应用于选择项</el-button>
    </el-col>
    <!-- 只作为title显示 -->
    <el-table class="title-table" :data="[{}]" style="width: 100%">
      <el-table-column align="center" header-align="center" width="48px" show-overflow-tooltip>
        <!-- 全选框 -->
        <!-- 参见 https://cn.vuejs.org/v2/api/#v-slot -->
        <template #header>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="handleCheckAll"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" width="60px" label="锁定"></el-table-column>
      <el-table-column align="center" header-align="center" width="80px" label="审核"></el-table-column>
      <!-- ... -->
    </el-table>

    <el-col v-for="(item, index) in tableData" :key="item.id">
      <!-- 订单信息 -->
      <div class="content-row">
        <div class="content-col col-1 col-48">
          <el-checkbox @change="handleParentCheckBoxChange(item, index, $event)" v-model="item.checked"></el-checkbox>
        </div>
        <!-- ... -->
      </div>
    </el-col>

    <!-- 子订单 -->
    <el-table ref="refTable" class="content-table" :show-overflow-tooltip="true" :data="item.send_items" style="width: 100%">
      <el-table-column align="center" header-align="center" width="48px">
        <template slot-scope="scope">
          <el-checkbox @change="handleChildCheckBoxChange(scope.row, $event)" v-model="scope.row.checked"></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column align="center" header-align="center" width="80px" prop="lockFlag">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.lockFlag" class="item" effect="dark" :content="scope.row.lockMemo">
            <el-col>
              <span class="is-lock">
                <i :class="scope.row.lockFlag | translateLockFlag"></i>
                <i :class="scope.row.giftFlag | translateGiftFlag"></i>
              </span>
            </el-col>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑---待定 -->
    <edit-dialog @actionEmit="handleActionEmit" ref="editorders"></edit-dialog>
  </div>
</template>

<script>
import * as Desc from "./desc";
import {loopRules} from './hight'
export default {
  data() {
    return {
      tableData: [],
      Dec,
      actionList: Desc.actionList, // 操作列表
      actionStatus: "", // 当前选中的操作项，即url
      param: {}, // 所有接口的参数
    };
  },
  created() {
    this.initParam();
    this.getTableData();
  },
  computed: {},

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
    // 需要添加备注
    // 只是正好 这里的两个接口的备注字段都叫 lockMark
    // 可以在接口描述对象上设置是有备注的标志位，
    _needMark() {
      // 参数里有这个字段 要调用Message-box
      return this.currentParam.hasOwnProperty("lockMemo");
    },
    openMarkPrompt() {
      this.$prompt("请输入备注（非必填项）", "备注", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false,
        closeOnClickModal: false,
        inputValidator: () => {},
      })
        .then(({ value }) => {
          console.log("prompt value value", value);
          this.currentParam.lockMemo = value;
          this.submit();
        })
        .catch((e) => {
          console.log("e", e);
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },

    // 处理没有操作项的情况
    _needActionStatusAndData() {
      if (!this.actionStatus) {
        this.$notify({
          title: "提示",
          message: "请选择操作项",
          type: "warnning",
          duration: 3000,
        });
        return false;
      }

      if (this.checkedList.length === 0) {
        this.$notify({
          title: "提示",
          message: "请勾选数据",
          type: "warnning",
          duration: 3000,
        });
        return false;
      }
      return true;
    },
    // 弹窗返回的表单数据和勾选数据中筛选出的参数合并
    handleActionEmit(form) {
      let readyForm = Object.assign(this.currentParam, form);
      this.submit();
    },

    submit() {
          let actionApi = Desc.actionToApi(this.actionStatus);
          let submitData = JSON.parse(JSON.stringify(this.currentParam));
          let { data, err } = await axiosApi(Desc[actionApi], submitData);
    },
    // 获取列表数据
    async getTableData() {
      let { data, err } = await this.axiosApi(Desc.orderLists_api, this.queryPrdlists);
      this.tableData = data.data.data.data; // 这数据层级有点离谱ba
      this.addProperyForTableDataItem(); // 添加响应式checked属性
    },
    addProperyForTableDataItem() {
      for (let item of this.tableData) {
        this.$set(item, "checked", false);
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
		  // 父子 checkbox 勾选联动
    _checkParentAndChild(child, rootList) {
      let current;
      for (let i = 0; i < rootList.length; i++) {
        if (child["outstkCode"] === rootList[i]["outstkCode"]) {
          current = { index: i, parent: rootList[i], allChecked: false };
        }
      }
      if (child.checked === false) {
        current.parent.checked = false;
        return;
      } else {
        // console.log(current, current.parent);
        current.allChecked = true;
        for (let item of current.parent.send_items) {
          if (!item.checked) {
            current.allChecked = false;
          }
        }
      }
      if (current.allChecked) {
        current.parent.checked = true;
      }
    },
    // 接口映射请求字段,收集当前接口的参数
    _collectParam() {
      if (!this.actionStatus) return;

      this.initParam();
      let actionStatusApi = Desc.actionToApi(this.actionStatus);
      let currentParam = this.param[actionStatusApi]; // currentParam 是响应式数据，对他的修改，就是对 this.currentParam的修改
      for (let { child, parent } of this.checkedList) {
        for (let key in currentParam) {
          let endOfS = Array.from(key).slice(-1)[0] === "s" ? true : false;
          if (!child[key] && endOfS) {
            // outskCodes 与 child.outsktCode 和 stkCodes 与child.stkCode
						// 其实约定多选字段为数组类型就行了，后端给多选的字段加了“s”,只好拧巴一下
            let keyWithoutS = Array.from(key)
              .slice(0, key.length - 1)
              .join("");
            if (child[keyWithoutS] && currentParam[key] && currentParam[key].constructor === Array) {
              currentParam[key].push(child[keyWithoutS]);
            } else if (!child[key] && child[keyWithoutS] && !currentParam[key]) {
              currentParam[key] = child[keyWithoutS];
            }
          } else {
            currentParam[key] = child[key] ? child[key] : undefined;
          }
        }
      }
      // console.log("this.currentParam", this.currentParam);
    },
  },
  watch: {
    // 因为使用 this.addPropertyForTableDataItem(); 给this.tableData 的父子订单上都加了 添加响应式checked属性
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
        } else if (count > this.checkedList.length && this.checkedList.length > 0) {
          this.checkedAll = false;
          this.isIndeterminate = true;
        } else {
          this.checkedAll = false;
          this.isIndeterminate = false;
        }
      },
      deep: true,
    },
  },
};
</script>
