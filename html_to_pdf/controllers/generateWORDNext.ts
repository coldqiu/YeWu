const toDocx = require("html-to-docx");
import path from "path";
import ejs from "ejs";

import { valueToLabel, checkList } from "../utils/utils";
import { fieldAll, feeTypeList, buTypeList } from "../data";

const contentTemplatePath = "../template/word.ejs";

// 待完善
export async function post(ctx: any) {
  let billInfo = ctx.request.body;
  billInfo.buTypeLabel = valueToLabel(billInfo.buType, buTypeList);
  billInfo.feeTypeLabel = valueToLabel(billInfo.feeType, feeTypeList);

  let { arr, queryLength } = checkList(billInfo.tableHeaders, fieldAll);
  let HTMLStr = await getHtml(contentTemplatePath, { info: billInfo, tableDesc: arr, queryLength });

  let docx = await toDocx(HTMLStr, "<h1>header</h1>", {
    // margins: { top: 1800, header: 800, left: 900, bottom: 900, right: 900 },
    title: "title",
    header: true,
    fontSize: 19,
  });

  ctx.type = "docx";
  ctx.body = docx;
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
