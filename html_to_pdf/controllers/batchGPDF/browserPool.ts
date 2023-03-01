import puppeteer from "puppeteer";
import genericPool from "generic-pool";

export default function initBrowserPool(options: any): genericPool.Pool<puppeteer.Browser> {
  const {
    max = 10,
    min = 2,
    maxUses = 2048,
    // testOnBorrow = true,
    autostart = false,
    // idleTimeoutMillis = 6000,
    // evictionRunIntervalMillis = 0,// 默认值
    puppeteerArgs = {},
    // validator = () => Promise.resolve(true),
    ...otherConfig
  } = options;

  const factory = {
    create: () => {
      return puppeteer.launch(puppeteerArgs);
    },
    destroy: (instance: puppeteer.Browser) => {
      return instance.close();
    },
  };

  const pool = genericPool.createPool(factory, options);

  pool.use = (fn) => {
    let resource: puppeteer.Browser;
    return pool
      .acquire()
      .then((r: puppeteer.Browser) => {
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
