import puppeteer from "puppeteer";
import genericPool from "generic-pool";

declare interface KeyValueItem {
  label: string;
  value: number | string;
}

// 表头字段描述对象
declare interface FieldItem {
  displayFlag: number; // 应该是枚举类型 0 1
  mappingFieldName: string;
  mappingAttributeName: string;
  id: number;
  type: number; // 枚举 // 0 是查询无合计，1是统计有合计
  dimensionName: string;
  align?: string;
  width?: number;
}

// generic-pool 配置参数
declare interface InitGenericPoolOptions {
  max: number;
  min: number;
  maxUses: number;
  testOnBorrow: boolean;
  autostart: boolean;
  idleTimeoutMillis: number;
  evictionRunIntervalMillis: number;
  puppeteerArgs: object;
  validator: Function;
}
// 如何支持更多未知属性，泛型吗；

declare interface BrowserWidthPool extends puppeteer.Browser {
  pool: genericPool.Pool<puppeteer.Page>;
}
