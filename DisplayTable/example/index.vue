<template>
  <div>
    <display-table :tableDesc="tableDesc" :data="tableData" :loading="loading" @selection-change="handleSelectionChange">>
      <template #action="{ row }">
        <el-button @click="handlerInfo(row)" type="text">账单</el-button>
        <el-button @click="updateFile(row)" type="text">上传附件</el-button>
        <el-button @click="actionHistory(row)" type="text">操作详情</el-button>
      </template>
    </display-table>
  </div>
</template>

<script>
import DisplayTable from '../index'
import { tableDesc } from './config'
export default {
  components: {DisplayTable},
  data() {
    return {
      tableDesc,
      tableData: [],
      loading: false,
    }
  },
  methods: {
    handlerInfo(row) {
      //
    },
    updateFile(row) {
      //
    },
    actionHistory(row) {
      //
    },
    handleSelectionChange(val) {
      //
    }
  }
}
</script>

<style lang="scss" scoped></style>