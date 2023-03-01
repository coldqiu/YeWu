import { KeyValueItem, FieldItem } from "../types/global";

/**
 * 键值对转换
 * @param value
 * @param list
 * @returns
 */
export function valueToLabel(value: string | number, list: Array<KeyValueItem>): string | number {
  let item = list.find((item) => item.value === value);
  return item ? item.label : value;
}

/**
 *  账单详情表头字段匹配
 * @param tableHeaders
 * @param fieldAll
 * @returns
 */
export function checkList(tableHeaders: Array<string>, fieldAll: Array<FieldItem>) {
  let arr: Array<FieldItem> = [];
  let queryLength = 0;
  tableHeaders.forEach((item) => {
    let element = fieldAll.find((e) => {
      return e.dimensionName === item;
    });
    if (element) {
      arr.push(element);
      if (element.type === 0) {
        queryLength = queryLength + 1;
      }
    }
  });
  return { arr, queryLength };
}
