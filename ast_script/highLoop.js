function hightLoop(ast) {
  let object = {};
  // debugger;
  if (ast.children.length > 0) {
    for (let item of ast.children) {
      if (!item || !item.tag) continue;

      if (item.tag === "el-form-item") {
        // 文本节点没有tag
        // searchFormDesc.push(attrsMap); //
        // attrsMap: {
        //     label: "审核状态：",
        //   },
        if (item.children[0].tag === "search-input") {
          // 组件 <search-input>
          searchInputDesc = item.children[0].attrsMap;
        } else {
          // 循环按钮

          try {
            object = { ...object, ...item.attrsMap }; // label

            object.events = item.children[0].children[0].children[0].events;

            let arr = item.children[0].children[0].attrsMap["v-for"].split(" "); // list 如果有需要的话，这里做一个 处理嵌套的逻辑 直到找到 或未找到 v-for
            let list = arr[arr.length - 1];
            object.list = list;
            searchFormDesc.push(object);
          } catch (e) {
            searchFormDesc.push({ error: e, item: item });
          }
        }
      } else if (item.tag === "el-button") {
        // 处理按钮, 按钮内部可能是 文本或 a链接

        try {
          let object = item.attrsMap;
          console.log("item.children[0].tag", item.children[0].tag);
          if (item.children[0].tag === "a") {
            object.a = {};
            object.a.attrsMap = item.children[0].attrsMap;
            object.a.text = item.children[0].children[0].text;
          } else {
            object.text = item.children[0].text;
          }
          buttonListDesc.push(object);
        } catch (e) {
          buttonListDesc.push({ error: e, item: item });
        }
      } else if (item.tag === "a") {
        // 处理 a链接
      }
      //  else if () {
      //   // 处理 变量显示
      // }

      // 设置表头 set-table-header
      else if (item.tag === "el-table") {
        // 处理 el-table
        try {
          tableDesc.props = item.attrsMap;
        } catch (e) {
          tableDesc.props = { error: e };
        }
      } else if (item.tag === "el-table-column") {
        // 处理
        try {
          let object = {};
          object = item.attrsMap; // 记录el-table-column本身的属性
          if (item.scopedSlots) {
            // 记录template中的信息，以数组对象的形式记录子节点的tag、属性、内容；
            // 处理 多种类型的scope 例如 "请款类别" 、 "是否开票" ,不能这么一直写 if...else 去满足各种情况，需要抽象出一个通用的处理逻辑
            // 目前没有具名插槽，只处理默认插槽
            let scopedSlots = item.scopedSlots['"default"'].children;
            let list = [];
            collectInfo(scopedSlots, list);
            object.chidlren = list;
          }
          tableDesc.list.push(object);
        } catch (e) {
          console.log("catch e", e);
          tableDesc.list.push(JSON.stringify({ error: e, item: item }));
        }
      }

      if (item.children.length > 0) {
        hightLoop(item);
      }
    }
  }
}

var searchFormDesc = [];
var searchInputDesc = {};
var buttonListDesc = [];
var tableDesc = {
  props: {},
  list: [],
};

// 尝试引入，策略模式, 先根据 tag 将 ast 提取出来，在集中处理！？，这个样会产生两份数据

function traverseTeplate(ast) {
  hightLoop(ast);

  return {
    searchFormDesc,
    searchInputDesc,
    buttonListDesc,
    tableDesc,
  };
}

// module.exports = { traverseTeplate };
exports.default = traverseTeplate;

function collectInfo(elements, list = []) {
  if (!elements || elements.length === 0) {
    throw "collectInfo args elements need array";
  }
  for (let item of elements) {
    // 没有节点类型，使用是否有 tag 熟悉区分, 节点上type(1、2)具体含义是？
    let object = {};
    if (item.tag) {
      object.tag = item.tag;
      object.attrsMap = item.attrsMap;
      if (item.children && item.children.length > 0) {
        object.children = collectInfo(item.children);
      }
    } else {
      object.text = item.text;
      object.tokens = item.tokens;
    }
    list.push(object);
  }
  return list;
}
