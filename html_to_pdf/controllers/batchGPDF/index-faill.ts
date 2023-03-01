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
  let fakeData = [];
  for (let i = 0; i < 60; i++) {
    let clone = Object.assign({}, requestBody);
    clone.customerName = i;
    fakeData.push(clone);
  }

  let htmlStrList = await Promise.all(
    fakeData.map((item) => {
      return request({
        url: "/generateHTML",
        method: "post",
        data: item,
      });
    })
  );

  let resultList = await Promise.all(
    (
      await htmlStrList
    ).map(async (item) => {
      const { browser, page } = await browserPool.use(async (browser: any) => {
        if (!browser.pool) {
          browser.pool = initPagePool(pagePoolOptions, browser);
        }

        const page = await browser.pool.use(async (tab: puppeteer.Page) => {
          return tab;
        });

        return { browser, page };
      });

      let pdf = await genenerPdf(page, item.data, headerTemplate, footerTemplate);

      // 回收资源
      browser.pool.release(page);
      browserPool.release(browser);
      return pdf;
    })
  );

  ctx.type = "pdf";
  ctx.body = resultList[3];
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
