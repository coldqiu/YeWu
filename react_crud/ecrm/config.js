// 列表接口
export const list_api = {
  title: "列表接口",
  url: "xx/yy/zz",
  method: "post",
  data: {
    keyword: "",
    timeRange: []
  },
  showMessage: false
};

export const del_list_item_api = {
  title: "删除列表元素接口",
  url: "xx/yy/zz/del",
  method: "post",
  data: {
    id: []
  },
  showMessage: true
};