import path from "path";
import ejs from "ejs";

import { valueToLabel, checkList } from "../utils/utils";
import { fieldAll, feeTypeList, buTypeList } from "../data";

const contentTemplatePath = "../template/content.ejs";

export async function post(ctx: any) {
  let billInfo = ctx.request.body;
  billInfo.buTypeLabel = valueToLabel(billInfo.buType, buTypeList);
  billInfo.feeTypeLabel = valueToLabel(billInfo.feeType, feeTypeList);

  let { arr, queryLength } = checkList(billInfo.tableHeaders, fieldAll);
  let HTMLStr = await getHtml(contentTemplatePath, { info: billInfo, tableDesc: arr, queryLength });
  ctx.body = HTMLStr;
}
/**
 *
 * @param templatePath 模板内内容路径
 * @param data 账单数据
 * @returns Promise对象，最后返回html字符串
 */
async function getHtml(templatePath: string, data: object) {
  return await new Promise((resolve, reject) => {
    ejs.renderFile(
      path.resolve(__dirname, templatePath), // 模板
      data, // 数据
      function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
}
