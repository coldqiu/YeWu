import React, { useRef, useState } from "react";
import { Button, Popconfirm, Radio, Form, Input, Row, Col, DatePicker } from "antd";
import ProTable from "@ant-design/pro-table";

import { list_table_colunms, list_api, audit_api } from "./config";
import { replaceColumns } from "@/utils";
import useRequest from "@/hooks/useRequest";
import request from "@/api/request";
import Audit from "@/components/Audit";
import * as configAudit from "./configAudit";
import { collectParams } from "@/utils";

export default (props) => {
  console.log("Wans props", props);
  const actionRef = useRef();
  const optionsColumn = {
    dataIndex: "option",
    title: "操作",
    valueType: "option",
    width: 80,
    fixed: "right",
    render: (text, record, _, action) => [
      <span key="audit">
        {record.auditStatus === 0 ? (
          <Button onClick={() => audit(record)} type="link">
            审核
          </Button>
        ) : null}
      </span>,
    ],
  };
  // 定义操作请求函数及其状态
  const { execute: postFunc, loading: postLoading } = useRequest((options) => {
    return request(options);
  });
  const columns = replaceColumns(list_table_colunms, optionsColumn);
  // 导出相关函数 导出参数待处理
  function outConfirm(searchConfig) {
    let values = searchConfig.form.getFieldsValue(true);
    console.log("values:", values);
  }

  //
  // 审核
  const [visibleAudit, setVisibleAudit] = useState(false);
  const [auditInfo, setAuditInfo] = useState(null);
  function audit(record) {
    // 使用列表数据
    setVisibleAudit(true);
    setAuditInfo(record);
  }

  // 确定
  async function auditModalOk() {
    console.log("is.ok");
    // 校验 审核表单
    await formAudit.validateFields();
    // 收集参数
    let params = collectParams(audit_api, auditInfo);
    let values = formAudit.getFieldsValue(true);
    // 手动设置审核时间
    values.auditDate = Date.now();
    // “选择时间”字段 格式化
    values.payedDate = values.payedDate.valueOf();
    let config = { ...params, data: { ...params.data, ...values } };

    // 发送请求 页面有报错 待处理
    const res = await postFunc(config);
    if (res && res.code === 0) {
      auditModalCancel();
      // 刷新 列表
      actionRef.current.reload();
    }
  }
  // 关闭
  function auditModalCancel() {
    // 设置相关变量
    // 重置 auditInfo
    setAuditInfo({});
    setVisibleAudit(false);
    formAudit.resetFields();
    setAuditRemarksRules([{ max: 100, whitespace: true, message: "最多支持100个字符" }]);
  }

  // Audit 审核弹窗内的表单
  // slot
  const [formAudit] = Form.useForm();
  const [auditRemarksRules, setAuditRemarksRules] = useState([
    { max: 100, whitespace: true, message: "最多支持100个字符" },
  ]);

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // “驳回”时 备注必填
  function auditStateChange() {
    if (formAudit.getFieldValue("auditStatus") === 2) {
      setAuditRemarksRules([
        { required: true, message: "必填项" },
        { max: 100, whitespace: true, message: "最多支持100个字符" },
      ]);
    } else {
      setAuditRemarksRules([{ max: 100, whitespace: true, message: "最多支持100个字符" }]);
    }
  }
  // const auditStatus = formAudit.getFieldValue("auditStatus");
  // console.log("auditStatus11", auditStatus);

  // useEffect(() => {
  //   if (formAudit.getFieldValue("auditStatus") === 2) {
  //     setAuditRemarksRules([
  //       { required: true, message: "必填项" },
  //       { max: 100, whitespace: true, message: "最多支持100个字符" }
  //     ]);
  //   } else {
  //     setAuditRemarksRules([
  //       { max: 100, whitespace: true, message: "最多支持100个字符" }
  //     ]);
  //   }
  //   console.log("auditStatus22", auditStatus);
  // }, [auditStatus]);
  return (
    <div>
      <ProTable
        bordered
        columns={columns}
        actionRef={actionRef}
        request={async (params = { method: "post" }, sort, filter) => {
          const result = await request({
            ...list_api,
            data: { ...list_api.data, ...params },
          });
          return {
            data: result.data.pageList,
            success: true,
            total: result.data.total,
          };
        }}
        columnsState={{
          persistenceKey: `table-${list_api.url}`,
          persistenceType: "localStorage",
        }}
        rowKey="id"
        search={{
          defaultCollapsed: false,
          labelWidth: "auto",
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Popconfirm
              title="确定导出数据吗?"
              onConfirm={() => outConfirm(searchConfig, formProps)}
              okText="是"
              cancelText="否"
              key="out"
            >
              <Button>导出</Button>
            </Popconfirm>,
          ],
        }}
        form={{}}
        pagination={{
          pageSize: 10,
          position: "bottomLeft", //不支持 ？！
        }}
        headerTitle="表格标题"
        scroll={{
          scrollToFirstRowOnChange: true,
          x: "100%",
          // y: "calc(100vh - 212px)"
        }}
        // sticky
        // dom 环境复杂 position:sticky 的祖先滚动 不可控 在 Tabs组件dom上有 .ant-tabs元素 overflow: hidden；
      />
      <Audit
        isModalVisible={visibleAudit}
        handleOk={auditModalOk}
        handleCancel={auditModalCancel}
        dataSource={auditInfo}
        columns={configAudit.columns}
        width={900}
      >
        <Row>
          <Form
            form={formAudit}
            name="basic"
            layout="inline"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            style={{ width: "100%" }}
            initialValues={{ auditStatus: 1 }}
          >
            <Col span={8}>
              <Form.Item label="选择时间" name="payedDate" rules={[{ required: true, message: "必填项" }]}>
                <DatePicker showTime />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="审核" name="auditStatus" rules={[{ required: true, message: "必填项" }]}>
                <Radio.Group onChange={auditStateChange}>
                  <Radio value={1}>通过</Radio>
                  <Radio value={2}>驳回</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={16} style={{ marginTop: "22px" }}>
              <Form.Item label="备注" name="auditRemarks" rules={auditRemarksRules}>
                <Input.TextArea showCount maxLength={100} allowClear autoSize />
              </Form.Item>
            </Col>
          </Form>
        </Row>
      </Audit>
    </div>
  );
};
