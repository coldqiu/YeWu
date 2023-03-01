import React, { useState, useRef } from "react";
import { Drawer, Button, Row, Col, Typography } from "antd";
import ProTable from "@ant-design/pro-table";
import useRequest from "@/hooks/useRequest";
import request from "@/api/request";
import { getQueryUrl, replaceColumns } from "@/utils";
import { table_columns, list_api, export_api } from "./config";
import Edit from "./Edit";
import "./index.css";

const { Link } = Typography;

export default (props) => {
  const actionRef = useRef();
  const formRef = useRef();
  const [currentRecord, setCurrentRecord] = useState(null);
  // 列表数据
  const [dataSource, setDataSource] = useState(null);
  // 导出 url
  const [exportUrl, setExportUrl] = useState(undefined);
  // 勾选列表数据
  const [selectedRowKeysList, setSelectedRowKeysList] = useState([]);

  // 定义操作请求函数及其状态
  const { execute: postFunc, loading: postLoading } = useRequest((options) => {
    return request(options);
  });
  // 列表 自定义列
  //
  const [isVisibleEdit, setIsVisibleEdit] = useState(false);
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
            setIsVisibleEdit(true);
          }}
          type="link"
          size="small"
        >
          编辑
        </Button>
      </span>,
    ],
  };
  const columns = replaceColumns(table_columns, [actionColumn]);
  return (
    <Drawer
      title="应收汇总数据"
      onClose={props.onClose}
      visible={props.visible}
      closable={true}
      destroyOnClose={true}
      width={"100vw"}
      bodyStyle={{ padding: "0 18px" }}
    >
      <Row>
        <Col className="drawer_table_wrap">
          <ProTable
            bordered
            columns={columns}
            actionRef={actionRef}
            formRef={formRef}
            search={true}
            request={async (params = { method: "post" }, sort, filter) => {
              // 重置勾选
              setSelectedRowKeysList([]);
              params.pageNo = params.current;
              delete params.current;
              const result = await request({
                ...list_api,
                data: {
                  summaryIds: [props?.record?.id],
                  ...params,
                },
              });

              if (result && result?.code === 0) {
                setDataSource(result);

                let query = { summaryIdsStr: props?.record.id, pageSize: 9999999, pageNo: 1 };
                let url = getQueryUrl(query, export_api);
                setExportUrl(url);
                if (result.data.total === 0) {
                  setExportUrl("");
                }
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
            rowSelection={{
              selectedRowKeys: selectedRowKeysList,
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRowKeysList(selectedRowKeys);
                if (selectedRowKeys.length > 0) {
                  let query = {
                    pageNo: 1,
                    pageSize: 99999999,
                    idsStr: selectedRowKeys.join(","),
                  };
                  let url = getQueryUrl(query, export_api);
                  // 设置导出url
                  setExportUrl(url);
                } else {
                  let query = { summaryIdsStr: props?.record.id, pageSize: 9999999, pageNo: 1 };
                  let url = getQueryUrl(query, export_api);
                  setExportUrl(url);
                }
              },
            }}
            toolbar={{
              actions: [
                <Button key={"download"} disabled={exportUrl ? false : true}>
                  <Link href={exportUrl}>导出</Link>
                </Button>,
              ],
            }}
            // headerTitle={

            //   //
            // }
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
              // x: "100%",
              y: "calc(100vh - 265px)",
            }}
            rowKey="id"
            // rowKey={(record) => {
            //   return `${record.billMonth}-${record.billNo}`;
            // }}
            columnsState={{
              persistenceKey: `table-sys-yszk-detail-info-${list_api.url}`,
              persistenceType: "localStorage",
            }}
            onReset={() => {}}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: [10, 20, 50],
            }}
          ></ProTable>
        </Col>
      </Row>
      {isVisibleEdit ? (
        <Edit
          visible={isVisibleEdit}
          record={currentRecord}
          onOk={() => {
            actionRef.current.reload();
            setCurrentRecord(null);
            setIsVisibleEdit(false);
          }}
          onCancel={() => {
            setCurrentRecord(null);
            setIsVisibleEdit(false);
          }}
        />
      ) : null}
    </Drawer>
  );
};
