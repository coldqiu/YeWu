export default {
  data() {
    return {
      filters: {}, // table 头部筛选数据
      search: {}
    };
  },
  methods: {
    _collectParam() {
      // this.search 时间字段 转换
      // 时间范围能改成一个字段 数组类型就不用下面这些重复内容了，可以直接结构赋值
      let timeObj = {};
      let { order_time, pay_time, audit_time } = this.search;
      if (order_time) timeObj.orderStartTime = order_time[0];
      if (order_time) timeObj.orderEndTime = order_time[1];
      if (pay_time) timeObj.payStartTime = pay_time[0];
      if (pay_time) timeObj.payEndTime = pay_time[1];
      if (audit_time) timeObj.auditStartTime = audit_time[0];
      if (audit_time) timeObj.auditEndTime = audit_time[1];

      // 下拉搜索
      let obj = {};
      if (this.selected && this.selected.selected) {
        obj[this.selected.selected] = this.selected.inputValue;
      }
      // 分页
      let { pageSize, pageNo } = this.pagination;
      // filters 参数数据格式转换
      // 订单来源 billSource: [1]组件给的 数据类型是 数组， 后台要的参数 要整数 billSource: 1
      let filters = {};
      for (let key in this.filters) {
        // debugger;
        filters[key] =
          this.filters[key][0] !== undefined ? this.filters[key][0] : "";
      }

      // 聚合参数
      let form = {
        ...this.search,
        ...timeObj,
        ...obj,
        ...filters,
        pageSize,
        pageNo
      };
      // 删除多余字段
      if (form.order_time) delete form.order_time;
      if (form.pay_time) delete form.pay_time;
      if (form.audit_time) delete form.audit_time;

      return form;
    }
  }
};
