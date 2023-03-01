import _ from "lodash";
import moment from "moment";
import { fixUrl } from "@/api/request";

/**
 * 替换一个或多个列表描述对象
 * @param {*} columns
 * @param {*} list
 * @returns
 */
export function replaceColumns(columns, list) {
  if (list.constructor === Object.prototype.constructor) {
    list = [list];
  }

  let arr = _.cloneDeep(columns);
  for (let element of list) {
    let index = columns.findIndex((item) => {
      return item.dataIndex === element.dataIndex;
    });
    // findIndex没找到返回 -1
    if (index !== -1) arr.splice(index, 1, element);
  }
  return arr;
}

/**
  // 处理 多列 替换
 * @param {*} columns 
 * @param {*} list 
 */
export function replaceGroupsColumns(columns, list) {
  // debugger;
  if (list.constructor === Object.prototype.constructor) {
    list = [list];
  }
  let arr = _.cloneDeep(columns);
  for (let _item of arr) {
    if (!_item.columns) {
      arr = replaceColumns(arr, list); // 这一步 没必要循环 columns.length 次 待优化
    } else {
      for (let element of list) {
        let index = _item.columns.findIndex((item) => {
          return item.dataIndex === element.dataIndex;
        });
        // findIndex没找到返回 -1
        if (index !== -1) _item.columns.splice(index, 1, element);
      }
    }
  }

  return arr;
}

// // 处理 groups 包裹的 column
// if ()

/**
 *
 * @param {*} value 时间戳 字符串类型
 * @param {*} type  时间格式
 * @returns
 */
export function momentTime(value, type = "YYYY-MM-DD HH:mm:ss") {
  if (!value) return value;
  let time = Number(value) ? Number(value) : value;
  // console.log("moment(time)", moment(time));
  if (time) return moment(time).format(type);
}

/**
 * 返回收集参数后的接口描述对象
 * @param {'*'} desc 接口描述对象
 * @param {*} data 来自列表的数据可能是对象也可能是对象数组
 * @returns
 */
export function collectParams(desc, data = {}) {
  let res = {};

  for (let key in desc) {
    if (desc[key].constructor === Object.prototype.constructor) {
      // 处理非嵌套对象
      res[key] = Object.assign({}, desc[key]);
    } else {
      res[key] = desc[key];
    }
  }
  if (data instanceof Array) {
    for (let key in res.data) {
      if (res.data[key].constructor === Array.prototype.constructor) {
        res.data[key] = [];
        for (let item of data) {
          res.data[key].push(item[key]);
        }
      }
    }
  }
  if (data.constructor === Object.prototype.constructor) {
    if (!desc.data) return new Error("接口描述对象缺少data字段");
    let config = desc.data;
    for (let key in config) {
      res.data[key] = data[key];
    }
  }

  return res;
}

/**
 * // 时间范围转换为时间戳格式
 * @param {} list
 * @returns
 */
export function returnDayRange(list) {
  if (list.length !== 2) return null;
  return [moment(list[0]).startOf("day").valueOf(), moment(list[1]).endOf("day").valueOf()];
}

/**
 * 使用列表生成 select可用的options
 * @param {*} remoteList
 * @param {*} label 字段名
 * @param {*} value 字段名
 */
export function turnToSelectOptions(remoteList, label, value) {
  // if (!remoteList || remoteList.length === 0 || !label || !value) {
  //   throw "turnToSelectOptions 函数参数有误";
  // }
  let arr = [];
  for (let item of remoteList) {
    // if (item.label || item.value) 判断字段是否为空 待处理 没这个字段、字段为空
    arr.push({
      label: item[label],
      value: item[value],
      full: item,
    });
  }
  return arr;
}

export function isImg(dataurl) {
  // let arr = dataurl.split(",");
  // var type = arr[0].match(/:(.*?)\//)[1];
  var type = dataurl.match(/:(.*?)\//)[1];
  return type === "image";
}

// 从BetaSchemaForm 的配置columns 中获取表单的完整字段
export function collectFormFields(columns) {
  let arr = [];
  for (let item of columns) {
    if (item.dataIndex) {
      arr.push(item.dataIndex);
    }
    if (item.columns) {
      for (let node of item.columns) {
        arr.push(node.dataIndex ? node.dataIndex : item);
      }
    }
  }
  return arr;
}

export function _collectFormFields(columns) {
  let arr = [];
  for (let item of columns) {
    if (item.key) {
      arr.push(item.key);
    }
    if (item.columns) {
      for (let node of item.columns) {
        arr.push(node.key ? node.key : item);
      }
    }
  }
  return arr;
}

export function transformValueLabel(value, list) {
  let index = list.findIndex((item) => item.value === value);
  if (index !== -1) {
    return list[index].label;
  } else {
    return value;
  }
}

// 数字格式化
export function percentileMoney(num) {
  if (num != 0 && !num) return "";
  return (num || 0).toString().replace(/\d+/, function (n) {
    var len = n.length;
    if (len % 3 === 0) {
      return n.replace(/(\d{3})/g, ",$1").slice(1);
    } else {
      return n.slice(0, len % 3) + n.slice(len % 3).replace(/(\d{3})/g, ",$1");
    }
  });
}

// 从附件字段中筛选出图片
export function splitImageAndPdf(list) {
  if (!list || list.length === 0) return;
  let imageList = [];
  let pdfList = [];
  for (let item of list) {
    let type = item.split(".")?.pop();
    if (type === "pdf") {
      pdfList.push(item);
    } else {
      imageList.push({ src: item });
    }
  }

  return [imageList, pdfList];
}

// 拼接 查询 导出 附件 url
export function getQueryUrl(params, downloadApi) {
  let urlStr = undefined;
  // download_api
  let queryString = Object.keys(params).reduce((prev, current) => prev + `&${current}=${params[current]}`, "");
  urlStr = fixUrl(downloadApi.url + queryString);
  return urlStr;
}

// 删除columns数组中指定元素
export function deleteListItem(list, keys) {
  let arr = [];
  list.map((item) => {
    if (!item?.key) {
      throw "column 定义缺失 key属性";
    }
    if (!keys.includes(item.key)) {
      arr.push(item);
    }
  });
  return _.cloneDeep(arr);
  // return arr;
}
