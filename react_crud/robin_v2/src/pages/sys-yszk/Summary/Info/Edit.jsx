import React, { Fragment, useState } from "react";
import { Modal, Input, Table, Row, Col } from "antd";
import ProTable from "@ant-design/pro-table";
import useRequest from "@/hooks/useRequest";
import request from "@/api/request";
import { replaceColumns, transformValueLabel } from "@/utils";

import { edit_api, table_columns } from "./config";
import { buTypeList } from "../config";
import { cloneDeep } from "lodash";

export default (props) => {
  const { execute: postFunc, loading: postLoading } = useRequest((options) => {
    return request(options);
  });
  const [remarkValue, setRemarkValue] = useState(props?.record?.remark ? props?.record?.remark : "");
  let columns = cloneDeep(table_columns);
  columns.pop(); // 删除 操作列

  // 替换 产品大类
  const buTypeColumn = {
    title: "产品大类",
    key: "buType",
    ellipsis: true,
    width: 90,
    dataIndex: "buType",
    render: (text, record) => {
      return transformValueLabel(record?.buType, buTypeList);
    },
  };

  columns = replaceColumns(columns, [buTypeColumn]);
  return (
    <Modal
      title="编辑"
      visible={props.visible}
      width={1000}
      onOk={async () => {
        console.log("remarkValue", remarkValue);
        let res = await postFunc({
          ...edit_api,
          data: {
            id: props?.record.id,
            remark: remarkValue?.trim(),
          },
        });
        if (res?.code === 0) {
          props.onOk();
        }
      }}
      onCancel={props.onCancel}
    >
      <div>
        <ProTable
          bordered
          dataSource={[props?.record]}
          columns={columns}
          // rowKey="id"
          rowKey={(record) => {
            return `table-sys-yszk-detail-info-edit-${record?.id}`;
          }}
          scroll={{ x: 1000 }}
          size="small"
          search={false}
          options={false}
          pagination={false}
          columnsState={{
            persistenceKey: `table-sys-yszk-detail-info-edit`,
            persistenceType: "localStorage",
          }}
        ></ProTable>
        <Row style={{ marginTop: "12px" }}>
          <Col key="1">备注：</Col>
          <Col span={12} key="2">
            <Input.TextArea
              defaultValue={props?.record?.remark}
              onChange={(e) => {
                setRemarkValue(e.target.value);
              }}
              autoSize={{ minRows: 2, maxRows: 6 }}
              maxLength={200}
              showCount
              allowClear
            />
          </Col>
        </Row>
      </div>
    </Modal>
  );
};
