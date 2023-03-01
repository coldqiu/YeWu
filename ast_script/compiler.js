// const compileUtil = require("@vue/component-compiler-utils"); // 将 SFC 的三个标签内容分离出来；
const parseComponent = require("vue-template-compiler/build").parseComponent; // 将 SFC 的三个标签内容分离出来
const compiler = require("vue-template-compiler"); // 处理 SFC的<template>
const parser = require("@babel/parser"); // 处理 SFC的<script>
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const types = require("@babel/types");
const fs = require("fs");
const Buffer = require("buffer").Buffer;
const { declare } = require("@babel/helper-plugin-utils");
const { transformFromAstSync } = require("@babel/core");
const babelTemplate = require("@babel/template").default;
const traverseTeplate = require("./highLoop").default;

// node --inspect program.js

const source = fs.readFileSync("./audit.vue", "utf-8");

const res = parseComponent(source);

const ast = parser.parse(res.script.content, {
  sourceType: "module", // "script", "module", or "unambiguous" unambiguous parse会根据内容自己判断内容的sourceType
});

const template = compiler.compile(res.template.content, {
  whitespace: "condense",
});

// 下拉数据一定会在data() 中声明，但是定义可能在data() ,可能在<script>顶层,也可能是从外部引入的；

let config = traverseTeplate(template.ast);
// 处理vue template 有更好的方法吗，类似解析 js 的这种visitor模式
// 设计一个visitor模式代替 现在 highLoop.js的 内的if...else ?! 杀鸡用牛刀， 练习
// visitor模式太难，还是用 策略模式吧
// 将 highLoop.js 内写死的 tag 改成配置； 
// 需要获取的内容精确具体属性，修改目前获取整个attrsMap的做法
// 信息在叶子节点上；

config = "const config = " + JSON.stringify(config);
fs.writeFile("config-1.js", Buffer.from(config), (err) => {
  if (err) throw err;
  console.log("saved!");
});

// fs.writeFile("config-1.js", Buffer.from(config), (err) => {
//   if (err) throw err;
//   console.log("saved!");
// });

// 在解析代码时，记录数据在源码的行和列
const selectListPlugin = declare((api, options, dirname) => {
  api.assertVersion(7);
  return {
    pre(file) {
      file.set("object", {});
      // file.set("dataJS", ""); // 字符串，不行！？
      file.set("dataJS", []); // 字符串，不行！？
      file.set("apiDesc", {});
    },
    visitor: {
      ObjectMethod(path, state) {
        const object = state.file.get("object");
        let dataJS = state.file.get("dataJS");
        if (path.node.key.name === "data") {
          //
          path.traverse({
            ArrayExpression(curPath) {
              if (curPath.node.elements.length > 0) {
                let moduleName = curPath.parent.key.name;
                const code = generateExportString(moduleName, curPath.parent.value);
                dataJS.push(code);
              }
            },
          });
        }
      },
      ExpressionStatement(path, state) {
        // ObjectMethod(path, state) {
        // 筛选接口返回的数据，获取接口信息
        const apiDesc = state.file.get("apiDesc");
        let dataJS = state.file.get("dataJS");
        path.traverse({
          MemberExpression(curPath, state) {
            if (curPath.node.property.name === "payTypeList") {
              path.traverse({
                MemberExpression(signPath, state) {
                  if (signPath.node.object.type === "ThisExpression" && signPath.node.property.name === "$http") {
                    let apiName = "getPayTypeListAPI";
                    // 排除 this.$http.adornUrl
                    if (signPath.parent.arguments) {
                      let desc = signPath.parent.arguments[0];
                      apiDesc["getPayTypeListAPI"] = desc;
                      const code = generateExportString(apiName, desc);
                      dataJS.push(code);
                    }
                  }
                },
              });
            }
          },
        });
      },
    },
    post(file) {
      let dataJS = file.get("dataJS");
      let res = dataJS.join("\n");

      fs.writeFile("config-2.js", Buffer.from(res), (err) => {
        if (err) throw err;
      });

      // todo
      // 接口信息关联数据，数据和使用数据的配置关联
      // 将数据和 config 关联起来
      // 远程数据接口，视为数据，而不是接口配置
      // data.js 向外提供数据 与 config.js 引用数据用变量替代配置里的字符串，

      // 按钮上的事件，关联接口信息，注意参数的获取
      // 接口信息一般在弹窗组件
      // 按钮--函数--ref引用--弹窗方法---->提交函数--参数情况有多种，url在if...else中；
      // check 弹窗
    },
  };
});

const { code } = transformFromAstSync(ast, res.script.content, { plugins: [selectListPlugin] });

function generateExportString(moduleName, moduleAST) {
  // const buildExport = babelTemplate`
  // module.exports.${moduleName} = ${moduleAST}
  // `;
  const buildExport = babelTemplate`
  export const ${moduleName} = ${moduleAST}
  `;
  const ast = buildExport(); // <ExpressionStatement>
  const code = generate(ast).code;
  return code;
}
