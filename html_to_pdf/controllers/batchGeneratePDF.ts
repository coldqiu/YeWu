// 待优化，使用generic-pool，
import path from "path";
import fs from "fs";
import puppeteer from "puppeteer";
import genericPool from "generic-pool";

import { request } from "../utils/request";
import initPagePool from "./batchGPDF/pagePool";

const footerTemplate = fs.readFileSync(path.resolve(__dirname, "../template/footerTemplate.ejs"), {
  encoding: "utf-8",
});
const headerTemplate = fs.readFileSync(path.resolve(__dirname, "../template/headerTemplate.ejs"), {
  encoding: "utf-8",
});

async function initPupeteer() {
  const puppeteerArgs = {
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
  };

  return puppeteer.launch(puppeteerArgs).then((instance) => {
    return instance;
  });
}

function initPool(browser: puppeteer.Browser): genericPool.Pool<puppeteer.Page> {
  const pagePoolOptions = {
    max: 10,
    min: 2,
    maxUses: 2048,
    testOnBorrow: false,
  };
  return initPagePool(pagePoolOptions, browser);
}

let pool: genericPool.Pool<puppeteer.Page>;
// 执行初始化page pool
(async () => {
  let browser = await initPupeteer();
  pool = initPool(browser);
})();

export async function post(ctx: any) {
  let requestBody = ctx.request.body;
  // 请求接口"/generateHTML"获取HTML
  let res = await request({
    url: "/generateHTML",
    method: "post",
    data: requestBody,
  });
  let HTMLStr = res.data;
  let page: any;
  await pool.use((instance) => {
    page = instance;
  });
  let pdf = await genenerPdf(page, HTMLStr, headerTemplate, footerTemplate);
  pool.release(page);
  ctx.type = "pdf";
  ctx.body = pdf;
}

async function genenerPdf(page: puppeteer.Page, HTMLStr: string, headerTemplate: string, footerTemplate: string) {
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
  // await page.close();
  return pdf;
}
