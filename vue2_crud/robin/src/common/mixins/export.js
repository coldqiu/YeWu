import http from "@/utils/httpRequest";
export default {
  computed: {
    url: function () {
      // 导出全部数据,重置分页参数
      let pageSize = this.pagination.total;
      let pageNo = 1;
      let token = this.$cookie.get("token");
      let query = { ...this.form, token, pageSize, pageNo };
      let queryString = Object.keys(query).reduce(
        (prev, next) =>
          prev ? prev + `&${next}=${query[next]}` : `${next}=${query[next]}`,
        ""
      );

      return http.adornUrl(this.export_api.url + "?" + queryString);
    }
  }
};
