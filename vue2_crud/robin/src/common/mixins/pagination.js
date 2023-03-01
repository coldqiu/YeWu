export default {
  data() {
    return {
      pagination: {
        pageSize: 10,
        pageNo: 1,
        total: 0
      }
    };
  },
  methods: {
    handleSizeChange(val) {
      // eslint-disable-next-line
      this.pagination.pageSize = val;
      console.log(`每页 ${val} 条`);
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.pagination.pageNo = val;
      console.log(`当前页: ${val}`);
      this.getDataList();
    }
  }
};