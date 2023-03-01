import genericPool from "generic-pool";
import puppeteer from "puppeteer";

export default function initPagePool(options: any, browser: puppeteer.Browser): genericPool.Pool<puppeteer.Page> {
  const { max = 10, min = 2, maxUses = 2048 } = options;

  const factory = {
    create: () => {
      return browser.newPage();
    },
    destroy: async (instance: puppeteer.Page) => {
      return await instance.close();
    },
  };

  const pool = genericPool.createPool(factory, options);

  pool.use = (fn) => {
    let resource: any;
    return pool
      .acquire()
      .then((r: puppeteer.Page) => {
        resource = r;
        return r;
      })
      .then(fn)
      .catch((err) => {
        pool.release(resource);
        throw err;
      });
  };

  return pool;
}
