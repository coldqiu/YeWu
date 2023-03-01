<template>
  <div class="filterTable">
    <el-popover placement="right" width="200" :trigger="trigger">
      <ul class="list">
        <li class="item">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
        </li>
        <li class="item" v-for="item in arr" :key="item.key">
          <el-checkbox v-model="item.isRender" :checked="item.isRender">{{
            item.title
          }}</el-checkbox>
        </li>
      </ul>
      <el-button slot="reference">设置表头</el-button>
    </el-popover>
  </div>
</template>

<script>
// 顶部增加全选按钮
export default {
  name: "FilterTable",
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    trigger: {
      type: String,
      default: () => {
        return "hover";
      },
    },
  },
  data() {
    return {
      arr: JSON.parse(JSON.stringify(this.list)),
      isIndeterminate: false,
      checkAll: true,
    };
  },
  methods: {
    handleCheckAllChange() {},
  },
  watch: {
    arr: {
      handler: function(newVal) {
        // console.log("newVal", newVal);
        let arr = [];
        newVal.forEach((item) => {
          let { key, isRender } = item;
          arr.push({ key, isRender });
        });
        this.$emit("header-change", arr);
      },
      deep: true,
    },
  },
};
</script>

<style>
.list {
  display: inline-block;
  margin: 0;
  padding: 0;
  list-style: none;
}
.item {
  display: inline-block;
  margin: 0 15px;
  padding: 0 10px;
}
</style>
