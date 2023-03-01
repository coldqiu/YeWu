import React, { useState, useRef } from "react";
import { Drawer, Button, Space, Divider, Row, Col, Table, Typography } from "antd";
import ProDescriptions from "@ant-design/pro-descriptions";
import ProTable from "@ant-design/pro-table";
import TableSummary from "@/components/TableSummary";
import useRequest from "@/hooks/useRequest";
import request from "@/api/request";
import { getQueryUrl, replaceColumns } from "@/utils";
import { base_info_columns, table_columns, list_api } from "./config";

import { cloneDeep } from "lodash";
import { deleteListItem } from "@/utils";
const { Text } = Typography;

export default (props) => {
  const actionRef = useRef();
  const formRef = useRef();
  const [currentRecord, setCurrentRecord] = useState(null);
  const [dataSource, setDataSource] = useState(null);

  // 定义操作请求函数及其状态
  const { execute: postFunc, loading: postLoading } = useRequest((options) => {
    return request(options);
  });
  // 列表 自定义列
  // 若buType为万数，则该字段为对应的自助通账号，否则为null
  const accountNameColumn = {
    title: "自助通账号",
    key: "accountName",
    width: 110,
    dataIndex: "accountName",
    ellipsis: true,
    search: false, // buType为万数 才显示
    hideInTable: dataSource?.buType !== 3,
  };
  console.log("dataSource", dataSource);
  // 若buType为国内，国际，则该字段为对应的api主账号，否则为null
  const primaryApiAccountColumn = {
    title: "api主账号",
    key: "primaryApiAccount",
    width: 110,
    dataIndex: "primaryApiAccount",
    ellipsis: true,
    search: false, // buType为国内，国际 才显示
    hideInTable: dataSource?.buType === 3,
  };
  // 若buType为国内，国际，则该字段为对应的api子账号，否则为null
  const apiAccountColumn = {
    title: "api子账号",
    key: "apiAccount",
    width: 110,
    dataIndex: "apiAccount",
    ellipsis: true,
    search: false, // buType为国内，国际 才显示
    hideInTable: dataSource?.buType === 3,
  };
  const columns = replaceColumns(table_columns, [accountNameColumn, primaryApiAccountColumn, apiAccountColumn]);
  return (
    <Drawer
      title={`${props?.record?.billNo}`}
      placement="right"
      onClose={props.onClose}
      visible={props.visible}
      // closable={false}
      destroyOnClose={true}
      width={1000}
    >
      <ProDescriptions
        title="基础信息"
        column={4}
        columns={base_info_columns}
        dataSource={dataSource}
      ></ProDescriptions>
      <Divider className="drawer_divider_horizontal" />
      <Row>
        <Col className="drawer_table_wrap">
          <ProTable
            bordered
            columns={columns}
            actionRef={actionRef}
            formRef={formRef}
            request={async (params = { method: "post" }, sort, filter) => {
              params.pageNo = params.current;
              delete params.current;
              console.log("props", props);
              const result = await request({
                ...list_api,
                // data: { ...list_api.data, ...params },
                data: {
                  param: {
                    billNo: props.record.billNo,
                    buType: props.record.buType,
                    pageNo: 1, // 固定参数
                    pageSize: 1, // 固定参数
                  },
                  detailParam: {
                    buType: props.record.buType,
                    relationOrderId: props.record.id,
                    pageNo: params.pageNo,
                    pageSize: params.pageSize,
                  },
                },
              });
              if (result && result?.code === 0) {
                setDataSource(result.data);
                console.log("result", result);
                return {
                  data: result?.data?.rowList,
                  success: true,
                  total: result?.data?.total,
                };
              } else {
                return null;
              }
            }}
            headerTitle={<Col className="ant-descriptions-title">账单明细</Col>}
            summary={(currentData) => {
              // 删除 hideInTable： true 的列
              let visibleColumns = columns.filter((item) => {
                return item.hideInTable === undefined || item.hideInTable === false;
              });
              // console.log("visibleColumns", visibleColumns);
              return TableSummary(currentData, dataSource, visibleColumns);
            }}
            options={false}
            //  暂时禁用
            //  设置列左右固定是 列表的“数据部分”和“合计” 行为不一致
            search={false}
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
              y: "calc(100vh - 255px)",
            }}
            rowKey="billNo"
            columnsState={{
              persistenceKey: `table-sys-yszk-detail-info-${list_api.url}`,
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
        </Col>
      </Row>
    </Drawer>
  );
};
