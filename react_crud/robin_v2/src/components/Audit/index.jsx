import React, { useRef, useState, useEffect } from "react";
import { Modal, Button, Form } from "antd";
import ProDescriptions from "@ant-design/pro-descriptions";

/**
 * props:
 * columns 列表描述对象
 * dataSource 列表数据
 *
 */
export default (props) => {
  const actionRef = useRef(null);
  const form = Form.useForm();
  let tmp = Object.assign({}, props.dataSource);
  // 这样初始化 info 咋就不对
  const [info, setInfo] = useState({
    ...tmp,
    auditStatus: Date.now(), // 初始化 “审核时间”字段 默认当前时间
    auditRemarks: "auditRemarks",
    payedDate: Date.now(), // “选择时间”字段 文案待定 默认当前时间
  });

  useEffect(() => {
    setInfo({
      ...props.dataSource,
      auditStatus: Date.now(), // 初始化 “审核时间”字段 默认当前时间
      auditRemarks: "",
      auditStatus: "",
      payedDate: Date.now(), // “选择时间”字段 文案待定 默认当前时间
    });
  }, [props.dataSource]);

  // 关闭 直接调用 props.handleCancel

  return (
    <Modal
      title="审核"
      visible={props.visible}
      // onOk={props.handleOk}
      onCancel={props.handleCancel}
      width={props.width ? props.width : 900}
      // footer={props.footer}
      destroyOnClose={true}
      footer={[
        <Button key="close" onClick={props.handleCancel} type="primary">
          关闭
        </Button>,
        <Button
          key="submit"
          type="primary"
          // loading={props.postLoading}
          onClick={props.handleOk}
        >
          确定
        </Button>,
      ]}
    >
      <ProDescriptions
        actionRef={actionRef}
        ellipsis={true}
        editable={{}}
        dataSource={info}
        rowKey="id"
        columns={props.columns}
      >
        {props.children}
      </ProDescriptions>
    </Modal>
  );
};
