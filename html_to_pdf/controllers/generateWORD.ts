const HtmlDocx = require("html-docx-js");

import { request } from "../utils/request";

// 下面这个处理要进行5万次该怎么优化，可以用上多线程吗
// pm2 创建多个服务实例、或者child_process
export async function post(ctx: any) {
  let requestBody = ctx.request.body;
  let res = await request({
    url: "/generateHTML",
    method: "post",
    data: requestBody,
  });
  let docx = HtmlDocx.asBlob(res.data, { margins: { top: 820, left: 920, right: 920, bottom: 820 } });

  ctx.type = "docx";
  ctx.body = docx;
}
