<template>
  <div class="filterTable">
    <el-dropdown :hide-on-click="false">
      <span class="el-dropdown-link">
        设置表头<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="hasCheckAll">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
        </el-dropdown-item>
        <el-dropdown-item v-for="item in arr" :key="item.props.prop">
          <el-checkbox v-model="item.isRender" :checked="item.isRender">{{
            item.props.label
          }}</el-checkbox>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
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
      }
    },
    trigger: {
      type: String,
      default: () => {
        return "hover";
      }
    },
    hasCheckAll: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {
      arr: JSON.parse(JSON.stringify(this.list)),
      isIndeterminate: false,
      checkAll: true
    };
  },
  methods: {
    handleCheckAllChange(value) {
      this.arr.forEach(item => {
        item.isRender = value;
      });
      this.$emit("header-change-all");
    }
  },
  watch: {
    arr: {
      handler: function(newVal) {
        let arr = [];
        let checkedLength = 0;
        newVal.forEach(item => {
          if (item.isRender) checkedLength++;
          let { props, isRender } = item;
          arr.push({ key: props.prop, isRender });
        });
        this.checkAll = checkedLength === arr.length;
        this.isIndeterminate = checkedLength > 0 && checkedLength < arr.length;
        // console.log("this.$router", this.$router);
        // console.log("this.$route", this.$route);
        // localStorage.setItem(tableName, arr)
        this.$emit("header-change", arr);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="scss" scope>
.el-dropdown-menu {
  max-height: 80vh;
  overflow: auto;
}
</style>
