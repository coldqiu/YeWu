<template>
  <div class="tabsContent">
    <div class="bottom">
      <div class="yuntx ">
        <set-table-header
          :default-list="defaultList"
          :check-list="checkList"
          @change="changeFn"
          name="channelReqfund"
        ></set-table-header>
        <!--采购订单  aduit -->
        <el-form :model="dataForm">
          <el-form-item label="审核状态：">
            <div class="activeList">
              <div class="tabs" v-for="item in auditStatusList" :key="item.key">
                <div @click="aduitStatusFn(item.key)" :class="{ active: item.key === aduitStatusBtn }">
                  {{ item.value }}
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="申请时间：">
            <div class="activeList">
              <div class="tabs" v-for="item in orderStartTimeList" :key="item.key">
                <div @click="orderTimeBtnFn(item.key)" :class="{ active: item.key == orderTimeBtn }">
                  {{ item.value }}
                </div>
              </div>
              <el-date-picker
                class="defaultDatePicker"
                type="daterange"
                range-separator="至"
                v-model="orderSearchData"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="timestamp"
                @change="orderChangeDateFn"
                :clearable="false"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item class="audit-wrapper" label="搜索条件：">
            <search-input
              :inputValue="dataForm.billNo"
              :all-list="allList"
              :page="page"
              :size="size"
              ref="searchInput"
              @change="handleFilter"
              @keyup.enter.native="getDataList()"
            ></search-input>
            <div class="table-tip">
              <p>
                共查询&nbsp;<span>{{ total }}</span
                >&nbsp;条采购订单，付款金额共&nbsp;
                <span>
                  {{ totalAmount | toFixed | percentileMoney }}
                </span>

                &nbsp;元
              </p>
              <p>
                实付金额
                <span>{{ payAmount | toFixed | percentileMoney }}</span
                >元， 未付金额 <span>{{ unPayAmount | toFixed | percentileMoney }}</span
                >元
              </p>
            </div>
          </el-form-item>

          <!-- 另一种写法
         <el-form-item label="搜索条件：">
          <el-input placeholder="请输入" v-model="dataForm.value" clearable>
            <el-select
              v-model="dataForm.type"
              slot="prepend"
              placeholder="请选择"
              class="filter-select"
            >
              <el-option label="全部条件" :value="0"></el-option>
              <el-option label="供应商名称" :value="1"></el-option>
              <el-option label="通道标识" :value="5"></el-option>
              <el-option label="合同编号" :value="4"></el-option>
              <el-option label="添加用户" :value="2"></el-option>
              <el-option label="产品名称" :value="3"></el-option>
            </el-select>
          </el-input>
        </el-form-item> -->
        </el-form>
        <div class="btn-group">
          <el-button
            size="small"
            type="primary"
            class="download-btn"
            :disabled="imgUrls.length == 0 || imgUrls.length > 50"
          >
            <a v-if="imgUrls.length > 0 && imgUrls.length <= 50" download target="_self" :href="url">下载附件</a>
            <span v-else>下载附件</span>
          </el-button>
          <el-button size="small" type="primary" @click="handleAdd(1, '', payoutBtn)">新建 </el-button>
          <el-button class="download-btn" type="primary" size="small" :disabled="downLoadUrl == ''">
            <a download :href="downLoadUrl" :style="{ padding: '5px 0' }" v-if="downLoadUrl != ''">导出</a>
            <span v-else>导出</span>
          </el-button>
        </div>
        <el-table
          :data="tableData"
          :default-sort="{ prop: 'date', order: 'descending' }"
          v-loading="loading"
          style="width: 100%"
          max-height="700"
          border
          :row-class-name="tableRowClassName"
          :header-cell-style="tableHeaderRowClassName"
          @selection-change="handleSelectionChange"
          @filter-change="handleFilterPaytype"
        >
          <el-table-column type="selection" :selectable="checkSelectable" width="55" fixed="left"></el-table-column>

          <el-table-column prop="orderMonth" label="所属期间" width="200" v-if="defaultList.includes('所属期间')">
            <template slot-scope="scope">
              <el-button type="text" @click="orderDetail(scope.row)">{{ scope.row.orderDate }} </el-button>
            </template>
          </el-table-column>

          <el-table-column
            prop="serviceSalesmanName"
            label="请款类别"
            show-overflow-tooltip
            v-if="defaultList.includes('请款类别')"
            :filters="payTypeList"
            :filter-multiple="false"
            filter-placement="bottom"
            width="100"
            column-key="payTypeId"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.orderPaytypeLabel }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="orderAmount"
            label="付款金额"
            show-overflow-tooltip
            width="160"
            v-if="defaultList.includes('付款金额')"
          >
            <template slot-scope="{ row }">
              <!-- payoutBtn 2 都保留两位小数，采用四舍五入-->
              {{ row.orderAmount | toFixed | percentileMoney }}
            </template>
          </el-table-column>

          <el-table-column label="是否开票" show-overflow-tooltip v-if="defaultList.includes('是否开票')">
            <template slot-scope="scope">
              <div>
                <div v-if="scope.row.orderBilling == 1">是</div>
                <div v-if="scope.row.orderBilling == 2">否</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="添加时间" width="170" show-overflow-tooltip v-if="defaultList.includes('添加时间')">
            <template slot-scope="{ row }">
              <div v-if="row.createTime">
                {{ $moment(Number(row.createTime)).format("YYYY-MM-DD HH:mm:ss") }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="附件" prop="imgUrls" width="350" v-if="defaultList.includes('附件')">
            <template slot-scope="scope">
              <template v-for="(item, index) in scope.row.imgUrls">
                <img v-if="isImg(item)" :key="index" class="attchment" :src="item" @click="showImg(item)" />
                <a v-else :key="index" :href="item" class="attchment" style="display:inline" target="_blank">
                  {{ formatFileName(index, item) }}
                </a>
              </template>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="180" v-if="defaultList.includes('操作')">
            <template slot-scope="{ row }">
              <!-- v-if="row.isAudit == 1" -->

              <el-button v-if="row.isAudit == 1" @click="passagewayAduitFn(row, payoutBtn)" type="text" size="small"
                >审核
              </el-button>
              <el-button @click="supplierDetailsFn(row, payoutBtn)" type="text" size="small">详情 </el-button>
              <template v-if="row.orderStatus == 2">
                <el-button @click="handlePay(row, payoutBtn)" type="text" size="small" :disabled="row.isPayed == 1"
                  >付款
                </el-button>
              </template>
              <el-button
                type="text"
                size="small"
                @click="handelSupple(row)"
                v-if="row.orderStatus == 1"
                :disabled="row.imgUrls.length >= 10"
              >
                <!--  最多支持份附件 -->
                补充附件
              </el-button>
              <el-button
                @click="handleAdd(2, row, payoutBtn)"
                type="text"
                size="small"
                v-if="row.orderAuditLevel == '1'"
                >编辑
              </el-button>
              <el-button
                @click="handleDelete(row, payoutBtn)"
                type="text"
                size="small"
                v-if="row.orderAuditLevel == '1'"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="paginationBox">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="dataForm.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="dataForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
        <yuntx-examine ref="supplier" v-if="supplierVisible" @getDataList="getDataList"></yuntx-examine>
        <supplier-details
          ref="supplierDetails"
          v-if="supplierDetailsVisible"
          :dialogTableVisible.sync="supplierDetailsVisible"
        ></supplier-details>
        <add ref="add" v-if="addVisible" :addVisible.sync="addVisible" @refreshData="getDataList"></add>
        <pay ref="pay" v-if="payVisible" @refreshData="getDataList"></pay>
        <SettlementAmound
          ref="settlementAmound"
          v-if="settlementVisible"
          :dialogVisible.sync="settlementVisible"
          :type="payoutBtn === 6 ? 3 : payoutBtn"
        >
          <!-- 闪验同万数 -->
        </SettlementAmound>
        <SupportMentary
          ref="supportMentary"
          @initData="getDataList"
          v-if="supportVisible"
          :dialogVisible.sync="supportVisible"
        />
      </div>
    </div>
  </div>
</template>

<script>
const list = [
  { value: "单据编号" },
  { value: "编号" },
  { value: "申请人" },
  { value: "请款分类" },
  { value: "收款供应商名称" },
  { value: "所属期间" },
  { value: "运营商" },
  { value: "产品名称" },
  { value: "开户行" },
  { value: "开户名" },
  { value: "收款账号" },
  { value: "付款方名称" },
  { value: "付款金额" },
  { value: "实付金额" },
  { value: "未付金额" },
  { value: "币种" },
  { value: "人民币金额" },
  { value: "产品单价" },
  { value: "数量" },
  { value: "是否开票" },
  { value: "请款类别" },
  { value: "添加时间" },
  { value: "附件" },
  { value: "结算账单" },
  { value: "付款单位" },
  { value: "付款时间" },
  { value: "审核状态" },
  { value: "付款状态" },
  { value: "申请备注" },
  { value: "摘要" },
  { value: "操作" },
];
import SearchInput from "@/components/SearchInput";
import SetTableHeader from "@/components/SetTableHeader";

import YuntxExamine from "./ChannelReqfundDialog.vue";
import SupplierDetails from "./SupplierDetails.vue";
import Add from "./add";
import Pay from "./pay";
import SettlementAmound from "./dialog/settlementAmound";
import SupportMentary from "./dialog/supplementary";

export default {
  components: {
    SearchInput,
    YuntxExamine,
    SupplierDetails,
    SetTableHeader,
    Add,
    Pay,
    SettlementAmound,
    SupportMentary,
  },
  data() {
    return {
      supportVisible: false,
      page: 1,
      size: 10,
      allList: [
        { value: "billNo", message: "单据编号" },
        { value: "orderAddPersonName", message: "申请人" },
        { value: "supplierName", message: "供应商名称" },
        { value: "orderProductName", message: "产品名称" },
        { value: "businessId", message: "编号" },
        { value: "payDepart", message: "付款方名称" },
      ],
      loading: false,
      supplierVisible: false,
      supplierDetailsVisible: false,
      settlementVisible: false,
      total: 0,
      downLoadUrl: "",
      tableData: [],
      matchStatusBtn: "allDataList",
      aduitStatusBtn: "", //审核状态
      orderTimeBtn: "allDataList", //订单时间状态
      payStatusBtn: "allDataList", //到账时间
      auditStatusList: [
        //审核状态
        {
          key: "",
          value: "全部",
        },
        {
          key: 0,
          value: "待审核",
        },
        {
          key: 1,
          value: "审核中",
        },
        {
          key: 2,
          value: "通过",
        },
        {
          key: 3,
          value: "驳回",
        },
      ],
      // 订单时间
      orderStartTimeList: [
        {
          key: "allDataList",
          value: "全部",
        },
        {
          key: "today",
          value: "今天",
        },
        {
          key: "yesterday",
          value: "昨天",
        },
      ],
      // 到账时间
      payTimeList: [
        {
          key: "allDataList",
          value: "全部",
        },
        {
          key: "today",
          value: "今天",
        },
        {
          key: "yesterday",
          value: "昨天",
        },
      ],
      arrivalTimeList: [], //订单时间
      paySearchData: [], //到账时间
      orderSearchData: [],
      dataForm: {
        pageNo: 1,
        pageSize: 10,
        orderType: 1,
      },
      searchList: {},
      objData: {},
      checkList: list,
      defaultList: [],
      addVisible: false, //添加是否展示
      multipleSelection: [], //表格多选
      url: "", //下载附件地址
      payoutList: [
        {
          name: "国内短信",
          value: 1,
        },
        {
          name: "创蓝国际",
          value: 2,
        },
        {
          name: "创蓝万数",
          value: 3,
        },
        {
          name: "彩信视频",
          value: 5,
        },
        {
          name: "闪验",
          value: 6,
        },
        {
          name: "其他",
          value: 4,
        },
      ], //请款分类
      payoutBtn: 1,
      totalAmount: 0, //总金额
      payAmount: 0, //实付金额
      unPayAmount: 0, //未付金额
      payTypeList: [], //付款方式列表
      payVisible: false, //付款是否显示
      imgUrls: [],
      orComputed: false,
    };
  },
  watch: {
    $route() {
      this.initAudit();
    },
  },
  activated() {
    this.initAudit();
  },
  methods: {
    initAudit() {
      let regB = /(?=.*channelReqfund-audit)(?=.*billNo)(?=.*buCategory)/;
      if (regB.test(this.$route.fullPath)) {
        this.orComputed = true;
        this.dataForm.billNo = this.$route.query.billNo;
        this.dataForm.orderType = this.payoutBtn = Number(this.$route.query.buCategory);
      } else {
        this.orComputed = false;
      }
      this.getDataList();
      this.getPaytypeList();
    },
    orderDetail(data) {
      this.settlementVisible = true;
      this.$nextTick(() => {
        this.$refs.settlementAmound.init(data);
      });
    },
    isImg(item) {
      let i = item.lastIndexOf(".");
      if ((i != -1 && item.substr(i) == ".jpg") || item.substr(i) == ".jpeg" || item.substr(i) == ".png") {
        return true;
      } else {
        return false;
      }
    },
    formatFileName(index, item) {
      let i = item.lastIndexOf(".");
      if (item == "") {
        return "";
      } else if (i != -1) {
        return index + item.substr(i);
      } else {
        return index;
      }
    },
    checkSelectable(row) {
      if (row.imgUrls.length === 0) {
        return false;
      } else {
        return true;
      }
    },
    changeFn(e) {
      this.defaultList = e;
    },
    // 审核
    passagewayAduitFn(data, payoutBtn) {
      this.supplierVisible = true;
      this.$nextTick(() => {
        this.$refs.supplier.init(data, payoutBtn);
      });
    },
    // 详情
    supplierDetailsFn(data, payoutBtn) {
      this.supplierDetailsVisible = true;
      this.$nextTick(() => {
        this.$refs.supplierDetails.init(data, payoutBtn);
      });
    },
    handelSupple(data) {
      this.supportVisible = true;
      this.$nextTick(() => {
        // 闪验的上传api /addSyFile ；其他的页面使用同一url /addMsgFile
        this.$refs.supportMentary.init(data, this.payoutBtn);
      });
    },
    //审核状态
    aduitStatusFn(key) {
      this.aduitStatusBtn = key;
      let obj = {};
      obj.orderStatus = key;
      this.dataForm = Object.assign({}, this.dataForm, obj);
      this.getDataList();
    },
    // 订单时间
    orderTimeBtnFn(key) {
      this.orderSearchData = [];
      this.orderTimeBtn = key;
      let obj = {};
      if (key === "today") {
        let startTime = this.dayAndYesterdayTimeFn().todayStartTime;
        let endTime = this.dayAndYesterdayTimeFn().todayEndTime;
        obj.startTime = startTime;
        obj.endTime = endTime;
        this.orderSearchData = [startTime, endTime];
      } else if (key === "yesterday") {
        let startTime = this.dayAndYesterdayTimeFn().yesterdayStartTime;
        let endTime = this.dayAndYesterdayTimeFn().yesterdayEndTime;
        obj.startTime = startTime;
        obj.endTime = endTime;
        this.orderSearchData = [startTime, endTime];
      } else {
        obj.startTime = "";
        obj.endTime = "";
      }
      this.dataForm = Object.assign({}, this.dataForm, obj);
      this.getDataList();
    },
    // 自定义订单时间
    orderChangeDateFn(val) {
      if (val) {
        let obj = {};
        let startTime = val[0];
        let endTime = this.$moment(val[1])
          .endOf("day")
          .valueOf();
        obj.startTime = startTime;
        obj.endTime = endTime;
        this.dataForm = Object.assign({}, this.dataForm, obj);
        this.getDataList();
      }
      this.orderTimeBtn = "";
    },
    // 到账时间
    payTimeBtnFn(key) {
      this.paySearchData = [];
      this.payStatusBtn = key;
      let obj = {};
      if (key === "today") {
        let startTime = this.dayAndYesterdayTimeFn().todayStartTime;
        let endTime = this.dayAndYesterdayTimeFn().todayEndTime;
        obj.payStartTime = startTime;
        obj.payEndTime = endTime;
        this.paySearchData = [startTime, endTime];
      } else if (key === "yesterday") {
        let startTime = this.dayAndYesterdayTimeFn().yesterdayStartTime;
        let endTime = this.dayAndYesterdayTimeFn().yesterdayEndTime;
        obj.payStartTime = startTime;
        obj.payEndTime = endTime;
        this.paySearchData = [startTime, endTime];
      } else {
        obj.payStartTime = undefined;
        obj.payEndTime = undefined;
      }
      this.dataForm = Object.assign({}, this.dataForm, obj);
      this.getDataList();
    },
    // 自定义到账时间
    payChangeDateFn(val) {
      if (val) {
        let obj = {};
        let startTime = val[0];
        let endTime = this.$moment(val[1])
          .endOf("day")
          .valueOf();
        obj.payStartTime = startTime;
        obj.payEndTime = endTime;
        this.dataForm = Object.assign({}, this.dataForm, obj);
        this.getDataList();
      }
      this.payStatusBtn = "";
    },
    // 搜索
    handleFilter(paramsOneName, inputValue) {
      let key = paramsOneName;
      let inputValueSpace = inputValue.replace(/\s*/g, ""); //过滤空格
      if (key == "businessId") {
        var regu = /^[1-9]\d*$/; //搜索条件为编号时只允许输入数字
        if (!regu.test(inputValueSpace) && inputValueSpace != "") {
          this.$message.error("请输入正确的编号及编号格式！");
          return false;
        }
      }
      if (paramsOneName === "allQuery") {
        key = "all";
      }
      this.searchList = {};
      this.searchList[key] = inputValueSpace;
      this.getDataList();
    },
    getDataList(pageNo) {
      let requestUrl = "";
      if (this.payoutBtn == "1") {
        requestUrl = "/open/trans/supplier/msgList"; //国内
      } else if (this.payoutBtn == "2") {
        requestUrl = "/open/trans/supplier/tigList"; //国际
      } else if (this.payoutBtn == "3") {
        requestUrl = "/open/trans/supplier/wsList"; //万数
      } else if (this.payoutBtn == "5") {
        requestUrl = "/open/trans/supplier/figList"; //彩信
      } else if (this.payoutBtn == "4") {
        requestUrl = "/open/trans/supplier/elseList"; //其他
      } else if (this.payoutBtn == "6") {
        requestUrl = "/open/trans/supplier/syList"; // 闪验
      }
      // 表格数据
      this.loading = true;
      if (pageNo) {
        this.dataForm.pageNo = pageNo;
      }
      let reqData = { ...this.dataForm, ...this.searchList };
      this.tableData = [];
      this.$http({
        url: this.$http.adornUrl(requestUrl),
        method: "post",
        data: this.$http.adornData(reqData),
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.loading = false;
            this.tableData = data.data ? data.data : [];
            this.total = data.data ? Number(data.total) : 0;
            this.objData = data.data;
            this.totalAmount = data.data ? data.totalAmount : 0;
            this.payAmount = data.payAmount ? data.payAmount : 0;
            this.unPayAmount = data.unPayAmount ? data.unPayAmount : 0;
          } else {
            this.$message.error(data.msg || "请求失败");
            this.loading = false;
            this.tableData = [];
            this.total = 0;
          }
          this.handelExport();
        })
        .catch(() => {
          this.loading = false;
          this.$message.error("请求失败");
        });
    },
    /* 分页 */
    /* ================================================== */
    handleSizeChange(val) {
      this.dataForm.pageSize = val;
      this.dataForm.pageNo = 1;
      this.getDataList();
    },
    /* 选中日期触发 */
    /* ================================================== */
    changeDateFn(val) {
      if (val) {
        this.dataForm.startTime = val[0];
        this.dataForm.endTime = this.$moment(val[1])
          .endOf("day")
          .valueOf();
      }
      this.getDataList();
    },
    /* 当前页 */
    /* ================================================== */
    handleCurrentChange(val) {
      this.dataForm.pageNo = val;
      this.getDataList();
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    dayAndYesterdayTimeFn() {
      let obj = {
        todayStartTime: this.$moment()
          .startOf("day")
          .valueOf(),
        todayEndTime: this.$moment()
          .endOf("day")
          .valueOf(),
        yesterdayStartTime: this.$moment()
          .startOf("day")
          .add(-1, "days")
          .startOf()
          .valueOf(),
        yesterdayEndTime: this.$moment()
          .endOf("day")
          .add(-1, "days")
          .valueOf(),
      };
      return obj;
    },
    /*================================================
     *新建
     *================================================*/
    handleAdd(type, data, payoutBtn) {
      // 1.4.6.1 查询可填账单编号 增加字段
      // 根据 payoutBtnFn(item.value) 做映射
      //  {
      //     name: "国内短信",
      //     value: 1
      //   },
      //   {
      //     name: "创蓝国际",
      //     value: 2
      //   },
      //   {
      //     name: "创蓝万数",
      //     value: 3
      //   },
      // 国内："stateType":1
      // 国际："stateType":1,
      // 万数："stateType":2,
      // console.log("payoutBtn", payoutBtn);
      // payoutBtn 表示当前 tab页
      this.addVisible = true;
      this.$nextTick(() => {
        this.$refs.add.init(type, data, payoutBtn);
      });
    },
    /*================================================
     *导出
     *================================================*/
    handelExport() {
      let token = this.$cookie.get("token");
      if (this.total == 0) {
        this.url = "";
      } else {
        let data = { ...this.dataForm, ...this.searchList, token };
        data = Object.assign({}, data, {
          pageSize: this.total,
          pageNo: 1,
        });
        let queryString = Object.keys(data).reduce(
          (prev, next) => (prev ? prev + `&${next}=${data[next]}` : `${next}=${data[next]}`),
          ""
        );
        this.downLoadUrl = process.env.VUE_APP_BASE_API + "/robin/open/trans/supplier/file-msg-export?" + queryString;
      }
    },
    /*================================================
     *展示附件
     *================================================*/
    showImg(url) {
      let html = '<img src="' + url + '" width="800" height="680" />';
      this.$alert(html, "", {
        dangerouslyUseHTMLString: true,
        customClass: "img-wrapper",
        showConfirmButton: false,
        closeOnClickModal: true,
        showClose: false,
      })
        .then(() => {})
        .catch((action) => {});
    },
    /*================================================
     *表格选择
     *================================================*/
    handleSelectionChange(val) {
      this.imgUrls = [];
      this.multipleSelection = val;
      this.url = process.env.VUE_APP_BASE_API;
      let value = "";
      val.map((item) => {
        item.imgUrls.map((ele) => {
          this.imgUrls.push(ele);
        });
      });
      value = this.imgUrls.join(",");
      if (this.imgUrls.length > 50) {
        this.url = "";
        this.$message.warning("请选择小于50张图片进行下载！");
      } else if (this.imgUrls.length == 1) {
        this.url += "/robin/open/trans/payflow/downLoadImg?dataUrl=";
        this.url += value + "&token=" + this.$cookie.get("token");
      } else {
        this.url += "/robin/open/trans/payflow/zipDownloadAttachFile?attachFileUrls=";
        this.url += value + "&token=" + this.$cookie.get("token");
      }
    },
    /*================================================
     *请款分类筛选
     *================================================*/
    payoutBtnFn(key) {
      console.log("tab 切换 key", key);
      this.payoutBtn = key;
      this.dataForm = {
        ...this.dataForm,
        pageNo: 1,
        pageSize: 10,
        orderType: key,
      };
      let { paramsOneName, inputDisabledValue, allListMessage, select } = this.$refs.searchInput.$options.data();
      Object.assign(this.$refs.searchInput.$data, {
        paramsOneName,
        inputDisabledValue,
        allListMessage,
        select,
      });
      this.searchList = {};
      this.dataForm.billNo = "";
      if (this.orComputed) {
        this.$router.replace({ name: "channelReqfund-audit" });
      }
      this.getDataList();
    },
    /*================================================
     *付款方式筛选
     *================================================*/
    handleFilterPaytype(filters) {
      filters.hasOwnProperty("payStatus") && (this.dataForm.payStatus = filters.payStatus[0]);
      filters.hasOwnProperty("payTypeId") && (this.dataForm.payTypeId = filters.payTypeId[0]);
      this.getDataList();
    },
    /*================================================
     *获取付款方式列表
     *================================================*/
    getPaytypeList() {
      this.payTypeList = [];
      let a = 1;
      this.$http({
        url: this.$http.adornUrl("/data/trans/supplier/payType"),
        method: "post",
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (data.payType) {
            data.payType.forEach((ele, index) => {
              let json = {};
              json.text = ele.typeName;
              json.value = ele.id;
              this.payTypeList.push(json);
            });
          }
        } else {
          this.$message({
            message: data.msg || "请求失败",
            type: "error",
            duration: 1000,
          });
        }
      });
    },
    /*================================================
     *付款
     *================================================*/
    handlePay(data, payoutBtn) {
      this.payVisible = true;
      this.$nextTick(() => {
        this.$refs.pay.init(data, payoutBtn);
      });
    },
    /*================================================
     *删除
     *================================================*/
    handleDelete(data, payoutBtn) {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let requestUrl = "";
          if (payoutBtn == "1") {
            requestUrl = "/open/trans/supplier/msgDelete"; //国内
          } else if (payoutBtn == "2") {
            requestUrl = "/open/trans/supplier/tigDelete"; //国际
          } else if (payoutBtn == "3") {
            requestUrl = "/open/trans/supplier/wsDelete"; //万数
          } else if (payoutBtn == "5") {
            requestUrl = "/open/trans/supplier/figDelete"; //彩信
          } else if (payoutBtn == "4") {
            requestUrl = "/open/trans/supplier/elseDelete"; //其他
          } else if (payoutBtn == "6") {
            requestUrl = "/open/trans/supplier/syDelete";
          }
          this.$http({
            url: this.$http.adornUrl(requestUrl),
            method: "post",
            data: { id: data.id },
          })
            .then(({ data }) => {
              if (data && data.code === 0) {
                this.$message.success(data.msg);
                this.getDataList();
              } else {
                this.$message.error(data.msg);
              }
            })
            .catch(() => {
              this.$message.error("删除失败");
            });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.tabsContent {
  .bottom {
    border-bottom: 1px solid #e6eaf0;

    .tabs {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: -1px;

      > .tab {
        min-width: 100px;
        padding: 0 18px;
        background: #fff;
        height: 38px;
        line-height: 38px;
        color: #7983a0;
        cursor: pointer;
        font-size: 14px;
        text-align: center;
        border-bottom: 1px solid #e6eaf0;
      }

      > .active {
        color: #3964f9;
        border-top: 2px solid #3964f9;
        border-right: 1px solid #e6eaf0;
        border-left: 1px solid #e6eaf0;
        border-bottom: none;
      }
    }
  }

  .yuntx {
    padding-top: 20px;
    position: relative;

    .activeList {
      display: flex;
      flex-wrap: wrap;
      line-height: 36px;
      color: #515a6e;

      .actionName {
        margin-right: 10px;
      }

      .tabs {
        > div {
          cursor: pointer;
          padding: 0px 20px;
        }
      }
    }

    .active {
      background: #3e8ef7;
      color: #fff;
      border-radius: 4px;
    }
  }

  .attchment {
    display: inline-block;
    width: 60px;
    height: 60px;
    margin-right: 5px;
    cursor: pointer;
  }

  .btn-group {
    position: absolute;
    right: 120px;
    top: 20px;
    z-index: 999;

    .download-btn {
      margin-right: 12px;

      a {
        color: #fff;
      }
    }
  }

  .table-tip {
    float: right;
    font-size: 14px;

    span {
      color: #3e8ef7;
    }
  }

  .file-item {
    margin-right: 20px;
  }
}
</style>
