import React, { useRef, useState, Fragment } from "react";
import { Button, Spin, Typography, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ProTable from "@ant-design/pro-table";
import useRequest from "@/hooks/useRequest";
import request from "@/api/request";
import { getQueryUrl, replaceColumns } from "@/utils";
import { table_columns, list_api, export_api } from "./config";
import Info from "./Info";
const { Link } = Typography;

export default function Index(props) {
  const actionRef = useRef();
  const formRef = useRef();
  const [currentRecord, setCurrentRecord] = useState(null);
  // 定义操作请求函数及其状态
  const { execute: postFunc, loading: postLoading } = useRequest((options) => {
    return request(options);
  });
  const [isVisibleInfo, setIsVisibleInfo] = useState(false);

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
            setIsVisibleInfo(true);
          }}
          type="link"
          size="small"
        >
          应收汇总数据
        </Button>
      </span>,
    ],
  };
  const columns = replaceColumns(table_columns, [actionColumn]);
  // 列表数据
  const [dataSource, setDataSource] = useState(null);
  // 导出 url
  const [exportUrl, setExportUrl] = useState(undefined);
  // 勾选列表数据
  const [selectedRowKeysList, setSelectedRowKeysList] = useState([]);

  return (
    <Fragment>
      <Spin spinning={postLoading}>
        <ProTable
          bordered
          columns={columns}
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
              let query = Object.assign({}, params, { pageSize: 99999999, pageNo: 1 });
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
                summaryIdsStr: selectedRowKeys.join(","),
              };
              let url = getQueryUrl(query, export_api);

              // 设置导出url
              setExportUrl(url);
            },
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
            persistenceKey: `table-sys-yszk-summary-info-${list_api.url}`,
            persistenceType: "localStorage",
          }}
          search={{
            defaultCollapsed: true,
            labelWidth: "auto",
          }}
          pagination={{
            showSizeChanger: true,
            pageSize: 10,
            showQuickJumper: true,
            pageSizeOptions: [10, 20, 50],
          }}
        ></ProTable>

        {isVisibleInfo ? (
          <Info
            visible={isVisibleInfo}
            record={currentRecord}
            onClose={() => {
              setIsVisibleInfo(false);
              setCurrentRecord(null);
            }}
          />
        ) : null}
      </Spin>
    </Fragment>
  );
}
