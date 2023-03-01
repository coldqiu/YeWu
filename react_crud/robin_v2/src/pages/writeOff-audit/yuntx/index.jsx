export default function Index() {
  return <h1>page</h1>;
}

// import React, { useRef } from "react";
// import { Button } from "antd";
// import ProTable from "@ant-design/pro-table";
// import request from "@/api/request";
// import { list_table_colunms, list_api } from "./config";
// import { replaceColumns } from "@/utils";

// export default props => {
//   const actionRef = useRef();
//   const optionsColumn = {
//     dataIndex: "option",
//     title: "操作",
//     valueType: "option",
//     width: 80,
//     render: (text, record, _, action) => [
//       <span key="audit">
//         {record.auditStatus === 0 ? <Button type="link">审核</Button> : null}
//       </span>
//     ]
//   };
//   const columns = replaceColumns(list_table_colunms, optionsColumn);

//   return (
//     <ProTable
//       bordered
//       columns={columns}
//       actionRef={actionRef}
//       dateFormatter="string"
//       request={async (params = { method: "post" }, sort, filter) => {
//         const result = await request({
//           ...list_api,
//           data: { ...list_api.data, ...params }
//         });
//         return {
//           data: result.data.pageList,
//           success: true,
//           total: result.data.total
//         };
//       }}
//       columnsState={{
//         persistenceKey: `table-${list_api.url}-${props.currentTab}`,
//         persistenceType: "localStorage"
//       }}
//       rowKey={record => {
//         return `${props.currentTab}-${record.id}`;
//       }}
//       search={{
//         labelWidth: "auto"
//       }}
//       form={
//         {
//           // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
//           // syncToUrl: (values, type) => {
//           //   console.log("values, type", values, type);
//           //   if (type === "get") {
//           //     return {
//           //       ...values,
//           //       created_at: [values.startTime, values.endTime]
//           //     };
//           //   }
//           //   return values;
//           // }
//         }
//       }
//       pagination={{
//         pageSize: 10
//       }}
//       dateFormatter="string"
//       tableStyle={{ minWidth: "900px", overflow: "auto" }}
//     />
//   );
// };
