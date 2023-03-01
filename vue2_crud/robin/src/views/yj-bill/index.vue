<template>
  <div class="tabsContent">
    <display-table :tableDesc="tableDesc" :data="tableData" :loading="loading" @selection-change="handleSelectionChange">>
      <template #action="{ row }">
        <el-button @click="handleInfo(row)" type="text">账单</el-button>
        <el-button @click="updateFile(row)" type="text">上传附件</el-button>
        <el-button @click="actionHistory(row)" type="text">操作详情</el-button>
      </template>
    </display-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageNo"
      :page-sizes="[10, 20, 50, 100]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"></el-pagination>
  </div>
</template>

<script>
import {
  tableDesc,
  list_api,
  rules
} from "./desc";
import DisplayTable from "@/components/DisplayTable";
import PaginationMixin from "@/common/mixins/pagination";
import ExportMixin from "@/common/mixins/export";
import CollectionMixin from "@/common/mixins/collection";
export default {
  mixins: [PaginationMixin, ExportMixin, CollectionMixin],
  data() {
    return {
      rules,
      form: {},
      tableDesc,
      fold: true, // 顶部搜索区域是否折叠
      tableData: [], //列表数据
      loading: false, // 列表loading
      multipleSelection: [], // 多选框数据
    };
  },
  activated() {
    this.getDataList();
  },

  methods: {
    // 获取列表数据
    getDataList(resetPagination) {
      if (resetPagination) {
        this.pagination.pageNo = 1;
      }
      // 校验搜索条件各个字段
      let isValid = false;
      this.$refs.form.validate(bool => (isValid = bool));
      console.log("isValid", isValid);
      if (!isValid) {
        return;
      }
      let form = this._collectParam();
      let data = Object.assign({}, this.form);
      if (data.month) {
        // data.startmonth = new Date(this.form.month[0]).getTime();
        // data.endmonth = new Date(this.form.month[1]).getTime();
        data.startMonth = this.form.month[0];
        data.endMonth = this.form.month[1];
        delete data.month;
      }
      if (data.createTime) {
        data.startCreateTime = this.form.createTime[0];
        data.endCreateTime = this.form.createTime[1];
        delete data.createTime;
      }
      if (data.sendTime) {
        data.startSendTime = this.form.sendTime[0];
        data.endSendTime = this.form.sendTime[1];
        delete data.sendTime;
      }
      let realData = {};
      for (let key in data) {
        if (data[key] !== null && data[key] !== "") {
          realData[key] = data[key];
        }
      }
      this.loading = true;
      this.$http({
        method: "post",
        // url: `http://172.16.43.150:7788/robin${list_api.url}`,
        url: this.$http.adornUrl(list_api.url),

        data: { ...form, ...data }
      })
        .then(data => {
          if (data && data.data.code === 0) {
            this.tableData = data.data.page.list;
            this.pagination.total = data.data.page.total;
          } else {
            this.$message.error(data.data.msg);
          }
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
          this.$message.error(e);
        });
    },
  },
  watch: {
  },
  components: { DisplayTable }
};
</script>

<style lang="scss" scoped></style>
