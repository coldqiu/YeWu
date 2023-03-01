import React, { useState, useRef } from "react";

import ProTable from "@ant-design/pro-table";
import request from "@/api/request";
import { replaceColumns } from "@/utils";
import { column, list_api, auditStatusConfig, rechargeStatusConfig } from "./config";
import { transformValueLabel } from "@/utils";

// 供应商-价格管理
export default function Index(props) {
  const actionRef = useRef();
  const formRef = useRef();
  const [currentRecord, setCurrentRecord] = useState(null);
  const [dataSource, setDataSource] = useState(null);

  // 结算订单 自定义列
  // 自助通账号，若业务bu为国际国内，则无该字段
  const accountIdColumn = {
    title: "自助通账号",
    key: "accountName",
    width: 110,
    dataIndex: "accountName",
    search: false, // buType为万数 才显示
    ellipsis: true,
    hideInTable: props?.record?.buType !== 3,
  };
  // 产品账号，若业务bu为万数，则无该字段
  const platformAccountColumn = {
    title: "产品账号",
    key: "platformAccount",
    width: 110,
    dataIndex: "platformAccount",
    search: false, // buType为国内，国际 才显示
    ellipsis: true,
    hideInTable: props?.record?.buType === 3,
  };
  // 不同bu 审核状态枚举不同

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
  const rechargeStatusColumn = {
    title: "充值状态",
    key: "rechargeStatus",
    width: 110,
    dataIndex: "rechargeStatus",
    search: false,
    // 充值状态，国内国际（0：充值失败，1/2：充值成功，3：展示为空）万数(9:成功。11：展示为空其他：失败)
    renderText: (text, record) => {
      let label = "";
      if (props?.record?.buType && props?.record?.buType !== 3) {
        // 国内、国际
        label = transformValueLabel(record?.rechargeStatus, rechargeStatusConfig[props?.record?.buType]);
      } else {
        switch (record.rechargeStatus) {
          case 9:
            label = "成功";
            break;
          case 11:
            label = "未充值";
            break;
          default:
            label = "失败";
            break;
        }
      }
      return label;
    },
  };

  const auditRemarkColumn = {
    title: "审核备注", // 国内、国际，结算订单列表不需要  “审核备注”
    key: "auditRemark",
    width: 110,
    dataIndex: "auditRemark",
    search: false,
    ellipsis: true,
    hideInTable: props?.record?.buType !== 3,
  };
  const settleColumns = replaceColumns(column, [
    accountIdColumn,
    platformAccountColumn,
    auditStatusColumn,
    rechargeStatusColumn,
    auditRemarkColumn,
  ]);

  return (
    <ProTable
      bordered
      columns={settleColumns}
      actionRef={actionRef}
      formRef={formRef}
      request={async (params = { method: "post" }, sort, filter) => {
        params.pageNo = params.current;
        delete params.current;
        console.log("props", props);
        console.log("params", params);
        let billNoList = props.record.buType === 3 ? props.record.businessNo : props.record.businessId;
        if (params?.billNo && params.billNo?.trim() && props.record.buType === 3) {
          billNoList = params.billNo?.trim();
        }
        const result = await request({
          ...list_api,
          data: {
            buType: props?.record?.buType,
            billNoList: billNoList,
            billNo: params?.billNo && props.record.buType !== 3 ? params.billNo : null,
            pageSize: params.pageSize,
            auditStatusList: params.auditStatus !== undefined ? params.auditStatus : null,
            pageNo: params.pageNo,
          },
        });

        if (result && result?.code === 0) {
          setDataSource(result);
          return {
            data: result.page.list,
            success: true,
            total: result.page.total,
          };
        } else {
          setDataSource(null);
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
        persistenceKey: `table-sys-yszk-relateBill-info-settle-${list_api.url}`,
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
