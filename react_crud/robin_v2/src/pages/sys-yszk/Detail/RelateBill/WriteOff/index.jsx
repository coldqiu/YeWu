import React, { useState, useRef } from "react";
import { Typography } from "antd";
import ProTable from "@ant-design/pro-table";
import request from "@/api/request";
import { replaceColumns } from "@/utils";
import { column, list_api, auditStatusConfig, adjustTypeList, writeOffTypeList } from "./config";
const { Link } = Typography;

// 供应商-价格管理
export default function Index(props) {
  const actionRef = useRef();
  const formRef = useRef();
  const [currentRecord, setCurrentRecord] = useState(null);
  const [dataSource, setDataSource] = useState(null);

  // 销账订单 自定义列
  const accountIdColumn = {
    title: "自助通账号",
    key: "accountName",
    width: 110,
    dataIndex: "accountName",
    search: false, // buType为万数 才显示
    hideInTable: props?.record?.buType !== 3,
    ellipsis: true,
  };
  const platformAccountColumn = {
    title: "产品账号",
    key: "platformAccount",
    width: 110,
    dataIndex: "platformAccount",
    search: false, // buType为国内，国际 才显示
    ellipsis: true,
    hideInTable: props?.record?.buType === 3,
  };

  const productNameColumn = {
    title: "产品名称", // 产品名称，若业务bu为万数，则无该字段
    key: "productName",
    width: 110,
    dataIndex: "productName",
    search: false,
    ellipsis: true,
    hideInTable: props?.record?.buType === 3,
  };
  const productPricColumn = {
    title: "产品单价（元）",
    key: "productPrice",
    width: 120,
    ellipsis: true,
    dataIndex: "productPrice",
    search: false, // 若业务bu为万数，则无该字段
    hideInTable: props?.record?.buType === 3,
  };
  const filePathColumn = {
    title: "销账凭证",
    key: "filePath",
    width: 110,
    dataIndex: "filePath",
    search: false, // 若业务bu为万数，则无该字段
    hideInTable: props?.record?.buType === 3,
    ellipsis: true,
    renderText: (text, record) => {
      return record.filePath ? (
        <Link target="_blank" href={record.filePath}>
          销账凭证
        </Link>
      ) : null;
    },
  };

  const writeOffTypeColumn = {
    title: "销账类型",
    key: "writeOffType",
    width: 110,
    dataIndex: "writeOffType",
    search: false, // buType为国内，国际 才显示
    hideInTable: props?.record?.buType === 3,
    valueType: "select",
    fieldProps: {
      options: writeOffTypeList,
    },
  };
  const adjustTypeColumn = {
    title: "调差类型",
    key: "adjustType",
    width: 110,
    dataIndex: "adjustType",
    search: false,
    valueType: "select",
    fieldProps: {
      options: adjustTypeList,
    },
    hideInTable: props?.record?.buType === 3,
    // 若业务bu为万数，则无该字段
    // 调差类型，国内国际：（0-默认  1-汇率差异  2-手续费），
  };
  const adjustMoneyColumn = {
    title: "调差金额（元）",
    key: "adjustMoney",
    width: 120,
    dataIndex: "adjustMoney",
    ellipsis: true,
    search: false,
    hideInTable: props?.record?.buType === 3,
    // 若业务bu为万数，则无该字段
  };
  const auditStatusColumn = {
    title: "审核状态",
    key: "auditStatus",
    width: 80,
    dataIndex: "auditStatus",
    search: true,
    valueType: "select",
    fieldProps: {
      options: auditStatusConfig[props?.record?.buType], // 不同bu 枚举不同；
    },
  };
  const writeOffColumns = replaceColumns(column, [
    accountIdColumn,
    platformAccountColumn,
    productNameColumn,
    productPricColumn,
    filePathColumn,
    writeOffTypeColumn,
    adjustTypeColumn,
    adjustMoneyColumn,
    auditStatusColumn,
  ]);
  return (
    <ProTable
      bordered
      columns={writeOffColumns}
      actionRef={actionRef}
      formRef={formRef}
      request={async (params = { method: "post" }, sort, filter) => {
        params.pageNo = params.current;
        delete params.current;
        console.log("props", props);
        console.log("params", params);
        let billNoList =
          props.record.writeOffOrderBillNo.length > 0 ? props.record.writeOffOrderBillNo.join(",") : null;
        if (params?.billNo && params.billNo?.trim()) {
          billNoList = params.billNo?.trim();
        }
        const result = await request({
          ...list_api,
          data: {
            buType: props?.record?.buType,
            billNoList: billNoList,
            auditStatusList: params.auditStatus !== undefined ? params.auditStatus : null,
            pageSize: params.pageSize,
            pageNo: params.pageNo,
          },
        });
        if (result && result?.code === 0) {
          setCurrentRecord(result);
          return {
            data: result.page.list,
            success: true,
            total: result.page.total,
          };
        } else {
          setCurrentRecord(null);
          return null;
        }
      }}
      // headerTitle={<Col className="ant-descriptions-title">账单明细</Col>}
      search={{
        defaultCollapsed: true,
        labelWidth: "auto",
      }}
      options={{
        reload: false,
      }}
      // search={false}
      tableAlertRender={() => {
        return false;
      }}
      alwaysShowAlert={false}
      tableAlertOptionRender={() => {
        return false;
      }}
      scroll={{
        // scrollToFirstRowOnChange: true,
        x: "100%",
        y: "calc(100vh - 240px)",
      }}
      rowKey="billNo"
      columnsState={{
        persistenceKey: `table-sys-yszk-relateBill-info-writeOff-${list_api.url}`,
        persistenceType: "localStorage",
      }}
      onReset={() => {}}
      pagination={{
        showSizeChanger: true,
        pageSize: 10,
        showQuickJumper: true,
        pageSizeOptions: [10, 20, 50],
      }}
    ></ProTable>
  );
}
