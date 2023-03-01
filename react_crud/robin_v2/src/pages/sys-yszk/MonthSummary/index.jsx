import React, { useState, useRef, Fragment } from "react";
import { Drawer, Button, Space, Divider, Row, Col, Table, Typography } from "antd";
import ProTable from "@ant-design/pro-table";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import useRequest from "@/hooks/useRequest";
import request from "@/api/request";
import { getQueryUrl, replaceColumns } from "@/utils";
import { table_columns, list_api, export_api } from "./config";

const { Text, Link } = Typography;

export default (props) => {
  const actionRef = useRef();
  const formRef = useRef();
  const [currentRecord, setCurrentRecord] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  // 导出 url
  const [exportUrl, setExportUrl] = useState(undefined);
  // 勾选列表数据
  const [selectedRowKeysList, setSelectedRowKeysList] = useState([]);
  // 定义操作请求函数及其状态
  const { execute: postFunc, loading: postLoading } = useRequest((options) => {
    return request(options);
  });

  return (
    <ProTable
      bordered
      columns={table_columns}
      actionRef={actionRef}
      formRef={formRef}
      request={async (params = { method: "post" }, sort, filter) => {
        // 重置勾选
        setSelectedRowKeysList([]);
        params.pageNo = params.current;
        delete params.current;

        const result = await request({
          ...list_api,
          data: { ...list_api.data, ...params },
        });

        if (result && result?.code === 0) {
          setDataSource(result);
          let query = Object.assign({}, params, { pageSize: 9999999, pageNo: 1 });
          let url = getQueryUrl(query, export_api);
          setExportUrl(url);

          return {
            data: result.data.list,
            success: true,
            total: result.data.total,
          };
        } else {
          setDataSource(null);
          setExportUrl("");
          return null;
        }
      }}
      headerTitle={
        <div style={{ color: "#686868" }}>
          <ExclamationCircleOutlined style={{ color: "#108ee9" }} />
          <span style={{ paddingLeft: "5px", fontSize: "12px" }}>
            每月的月汇总应收数据于<strong>次月11号零点</strong>系统自动生成 ！
          </span>
        </div>
      }
      onReset={() => {
        // 重置勾选项
        setSelectedRowKeysList([]);
        actionRef.current.reloadAndRest();
      }}
      toolbar={{
        actions: [
          <Button key={"download"} disabled={exportUrl ? false : true}>
            <Link href={exportUrl}>导出</Link>
          </Button>,
        ],
      }}
      rowSelection={{
        selectedRowKeys: selectedRowKeysList,
        onChange: (selectedRowKeys, selectedRows) => {
          setSelectedRowKeysList(selectedRowKeys);
          let query = {
            pageNo: 1,
            pageSize: 99999999,
            idsStr: selectedRowKeys.join(","),
          };
          let url = getQueryUrl(query, export_api);
          // 设置导出url
          setExportUrl(url);
        },
      }}
      options={{
        reload: false,
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
        y: "calc(100vh - 265px)",
      }}
      rowKey="id"
      columnsState={{
        persistenceKey: `table-sys-yszk-month-summary-${list_api.url}`,
        persistenceType: "localStorage",
      }}
      pagination={{
        showSizeChanger: true,
        pageSize: 10,
        showQuickJumper: true,
        pageSizeOptions: [10, 20, 50],
      }}
    ></ProTable>
  );
};
