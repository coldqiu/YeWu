<template>
  <el-table :data="data" @filter-change="handleFilterChange" border max-height="700" v-loading="loading"
    :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :show-summary="showSummary"
    :summary-method="summaryMethod" Z:size="size">

    <template v-for="item in tableDesc">
      <!-- :key="item.props.prop"  -->
      <el-table-column v-bind="item.props" v-if="item.scope && item.isRender" :column-key="item.props.prop">
        <template slot-scope="{ row }">
          <slot :name="item.scope" :item="item" :row="row"> </slot>
        </template>
      </el-table-column>
      <el-table-column v-else-if="item.isRender === false ? false : true" v-bind="item.props"
        :column-key="item.props.prop">
      </el-table-column>
    </template>
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
    },
    info: { type: Object },
    showSummary: { type: Boolean },
    summaryMethod: { type: Function },
    size: {
      type: String,
      default: 'medium'
    }
  },
  methods: {
    handleFilterChange(filters) {
      this.$emit("filter-change", filters);
    },
    handleSelectionChange(val) {
      this.$emit("selection-change", val);
    }
  }
};
</script>

<style lang="scss" scoped></style>
