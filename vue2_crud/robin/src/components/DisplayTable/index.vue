<template>
  <!--2021/7/8修改 -:height="height"-->
  <!--2021/7/8修改 + max-height="700"-->
  <!--2021/7/8修改 + :row-class-name="tableRowClassName"-->
  <!--2021/7/8修改 + :header-cell-style="tableHeaderRowClassName"-->
  <el-table
    :data="data"
    @filter-change="handleFilterChange"
    border
    max-height="700"
    v-loading="loading"
    :row-class-name="tableRowClassName"
    :header-cell-style="tableHeaderRowClassName"
    @selection-change="handleSelectionChange"
    :show-summary="showSummary"
    :summary-method="summaryMethod"
    :size="size"
  >
    <!-- 修改tableDesc上字段描述的isRender标志位  -->
    <!-- 最后方法,修改数据 -->
    <!-- :filters="item.props.filters ? getFilterData(item) : null" -->

    <template v-for="item in tableDesc">
      <el-table-column
        v-bind="item.props"
        :key="item.props.prop"
        v-if="item.scope && item.isRender"
        :column-key="item.props.prop"
      >
        <template slot-scope="{ row }">
          <slot :name="item.scope" :item="item" :row="row"> </slot>
        </template>
      </el-table-column>
      <el-table-column
        v-else-if="item.isRender === false ? false : true"
        v-bind="item.props"
        :key="item.props.prop"
        :column-key="item.props.prop"
      >
      </el-table-column>
    </template>

    <!-- <slot name="appendPlus"> {{ console.log("row info", info) }}</slot> -->
    <template #append>
      <slot name="appendPlus" :info="info"> </slot>
    </template>
  </el-table>
</template>

<script>
// el-table 的事件只能一个个的向外传递吗
export default {
  name: "DisplayTable",
  props: {
    tableDesc: { type: Array },
    data: { type: Array },
    loading: { type: Boolean },
    height: {
      type: String,
      default: () => {
        return "85vh";
      }
    },
    info: { type: Object },
    showSummary: { type: Boolean },
    summaryMethod: { type: Function },
    size: {
      type: String,
      default: () => {
        return "medium ";
      }
    }
  },
  methods: {
    // get table column filter data
    // 添加一个标志位，使用计算属性 or method
    getFilterData(option) {
      // isRead
      // console.log("option 动态 filter 数据获取", option);
      // 动态数据怎么处理
      let list = [
        { text: "云通讯", value: 1 },
        { text: "CRM", value: 4 },
        { text: "SDK", value: 5 },
        { text: "统一平台--动态", value: 6 }
      ];
      return list;
    },
    handleFilterChange(filters) {
      // console.log("handleFilterChange", filters);
      this.$emit("filter-change", filters);
    },
    handleSelectionChange(val) {
      this.$emit("selection-change", val);
    }
  }
};
</script>

<style lang="scss" scoped>
// .el-table {
//   .el-table__body-wrapper {
//     max-height: 80vh;
//     overflow: scroll;
//   }
// }
</style>
