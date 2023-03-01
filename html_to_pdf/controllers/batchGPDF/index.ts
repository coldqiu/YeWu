import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

import initPagePool from "./pagePool";
import initBrowserPool from "./browserPool";
import { request } from "../../utils/request";

const footerTemplate = fs.readFileSync(path.resolve(__dirname, "../../template/footerTemplate.ejs"), {
  encoding: "utf-8",
});
const headerTemplate = fs.readFileSync(path.resolve(__dirname, "../../template/headerTemplate.ejs"), {
  encoding: "utf-8",
});
const browserPoolOptions = {
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

const pagePoolOptions = {
  max: 10,
  min: 2,
  maxUses: 2048,
  testOnBorrow: false,
  // autostart: false,
  // idleTimeoutMillis: 3600000,
  // evictionRunIntervalMillis: 180000,
};

const browserPool = initBrowserPool(browserPoolOptions);

export async function post(ctx: any) {
  let requestBody = ctx.request.body;
  // customerName
  // 请求接口"/generateHTML"获取HTML
  let res = await request({
    url: "/generateHTML",
    method: "post",
    data: requestBody,
  });

  let HTMLStr = res.data;
  let browserOut: any;
  let page: any;

  await browserPool.use(async (browser: any) => {
    browserOut = browser;
    if (!browser.pool) {
      browser.pool = initPagePool(pagePoolOptions, browser);
    }

    await browser.pool.use(async (tab: puppeteer.Page) => {
      page = tab;
      return tab;
    });
  });

  let pdf = await genenerPdf(page, HTMLStr, headerTemplate, footerTemplate);

  // 回收资源
  browserOut.pool.release(page);
  browserPool.release(browserOut);

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
  return pdf;
}
