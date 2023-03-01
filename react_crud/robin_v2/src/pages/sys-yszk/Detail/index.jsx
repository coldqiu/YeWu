import React, { useRef, useState, useEffect, Fragment } from "react";
import { Button, Popconfirm, Spin, Typography } from "antd";
import ProTable from "@ant-design/pro-table";
import useRequest from "@/hooks/useRequest";
import request from "@/api/request";
import { getQueryUrl, replaceColumns } from "@/utils";
import { table_columns, list_api } from "./config";
import Info from "./Info";
import RelateBill from "./RelateBill";

const { Link } = Typography;

export default function Index(props) {
  const actionRef = useRef();
  const formRef = useRef();
  const [currentRecord, setCurrentRecord] = useState(null);
  // 定义操作请求函数及其状态
  const { execute: postFunc, loading: postLoading } = useRequest((options) => {
    return request(options);
  });
  const [isVisibleRelateBill, setIsVisibleRelateBill] = useState(false);
  const billNoColumn = {
    title: "账单编号",
    key: "billNo",
    width: 160,
    dataIndex: "billNo",
    search: true,
    // copyable: true,
    // ellipsis: true,
    fixed: "left",
    renderText: (text, record) => {
      return (
        <Link
          onClick={() => {
            setCurrentRecord(record);
            setIsVisibleInfo(true);
          }}
        >
          {record.billNo}
        </Link>
      );
    },
  };
  // 操作列
  const actionColumn = {
    dataIndex: "action",
    title: "操作",
    width: 80,
    fixed: "right",
    search: false,
    render: (text, record, _, action) => [
      <span key="relateBill">
        <Button
          onClick={() => {
            setCurrentRecord(record);
            setIsVisibleRelateBill(true);
          }}
          type="link"
          size="small"
        >
          相关订单
        </Button>
      </span>,
    ],
  };
  const columns = replaceColumns(table_columns, [billNoColumn, actionColumn]);
  // 列表数据
  const [dataSource, setDataSource] = useState(null);

  // 账单详情
  const [isVisibleInfo, setIsVisibleInfo] = useState(false);
  return (
    <Fragment>
      <Spin spinning={postLoading}>
        <ProTable
          bordered
          columns={columns}
          actionRef={actionRef}
          formRef={formRef}
          request={async (params = { method: "post" }, sort, filter) => {
            params.pageNo = params.current;
            delete params.current;

            const result = await request({
              ...list_api,
              data: { ...list_api.data, ...params },
            });
            if (result && result?.code === 0) {
              setDataSource(result);
              return {
                data: result.page.list,
                success: true,
                total: result.page.total,
              };
            } else {
              return null;
            }
          }}
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
            y: "calc(100vh - 212px)",
          }}
          rowKey="id"
          columnsState={{
            persistenceKey: `table-sys-yszk-detail-${list_api.url}`,
            persistenceType: "localStorage",
          }}
          search={{
            defaultCollapsed: true,
            labelWidth: "auto",
          }}
          onReset={() => {}}
          pagination={{
            showSizeChanger: true,
            pageSize: 10,
            showQuickJumper: true,
            pageSizeOptions: [10, 20, 50],
          }}
        ></ProTable>

        {/* 账单详情 */}
        <Info
          visible={isVisibleInfo}
          record={currentRecord}
          onClose={() => {
            setIsVisibleInfo(false);
            setCurrentRecord(null);
          }}
        />

        <RelateBill
          visible={isVisibleRelateBill}
          record={currentRecord}
          onClose={() => {
            setIsVisibleRelateBill(false);
            setCurrentRecord(null);
          }}
        />
      </Spin>
    </Fragment>
  );
}
