import path from "path";
import fs from "fs";
import puppeteer from "puppeteer";

import { request } from "../utils/request";

const footerTemplate = fs.readFileSync(path.resolve(__dirname, "../template/footerTemplate.ejs"), {
  encoding: "utf-8",
});
const headerTemplate = fs.readFileSync(path.resolve(__dirname, "../template/headerTemplate.ejs"), {
  encoding: "utf-8",
});

// 最初的版本
export async function post(ctx: any) {
  let requestBody = ctx.request.body;
  // 请求接口"/generateHTML"获取HTML
  let res = await request({
    url: "/generateHTML",
    method: "post",
    data: requestBody,
  });

  let HTMLStr = res.data;

  let pdf = await genenerPdf(HTMLStr);
  ctx.type = "pdf";
  ctx.body = pdf;
}

async function genenerPdf(HTMLStr: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox", // linux系统中必须开启
      "--no-zygote",
      // "--single-process", // 此处关掉单进程
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--disable-extensions",
      "--disable-file-system",
      "--disable-background-networking",
      "--disable-default-apps",
      "--disable-sync", // 禁止同步
      "--disable-translate",
      "--hide-scrollbars",
      "--metrics-recording-only",
      "--mute-audio",
      "--safebrowsing-disable-auto-update",
      "--ignore-certificate-errors",
      "--ignore-ssl-errors",
      "--ignore-certificate-errors-spki-list",
      "--font-render-hinting=medium",
    ],
  });
  const page = await browser.newPage();
  await page.setContent(HTMLStr);
  let pdf = await page.pdf({
    format: "a4",
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: true,
    footerTemplate,
    headerTemplate,
    margin: {
      top: 80,
      bottom: 80,
      left: 40,
      right: 40,
    },
  });

  await browser.close();

  return pdf;
}
