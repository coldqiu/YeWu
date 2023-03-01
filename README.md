## 记录业务中遇到的问题及解决方案

* [订单列表业中如何实现不写if...else switch...case ，逻辑分支太多如何组织代码](https://juejin.cn/post/6938423195301052453)

  * 代码在`order_if_else`目录



* 简单好用的配置化`table`组件；模仿`antd table columns`，以对象数组形式配置`table`各个列，自定义列以具名插槽形式提供，渲染核心是 `v-for v-bind="object"`

  * 代码在`DisplayTable`目录

* 客户账单信息文件【word pdf格式】生成服务，核心是 使用`ejs`+数据，生成html文件，html文件+无头浏览器`puppeteer`生成pdf文件，html文件+`html-docx-js`生成word文件；
  * 代码在html_to_pdf目录

* vue2常用代码，在vue2_crud目录

* react常用代码，在react_crud目录

* AST脚本（解析table-column)，在目录ast_script


