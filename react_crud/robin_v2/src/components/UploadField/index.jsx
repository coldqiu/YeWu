import React, { useState, useEffect, useRef } from "react";

import { Upload, Button, message, Typography, Row, Col } from "antd";
import { UploadOutlined, DeleteOutlined, CheckCircleOutlined } from "@ant-design/icons";
import "./index.css";

// 不支持删除 已上传的附件
export default function UploadField(props) {
  const maxCount = props.maxCount ? props.maxCount : 5;
  // 需要上传的文件
  const [fileList, setFileList] = useState([]);
  // 已上传的文件
  const [isRepeatMessage, setIsRepeatMessage] = useState(false);
  console.log("isRepeatMessage", isRepeatMessage);
  function customRequest(file) {
    // 同时选中多个文件时 会多次触发这个事件
    // 附件数量限制 5
    // 一次性不能上传超过5个附件
    console.log("fileList", fileList.length);

    if (fileList.length > 4) {
      message.error("一次性不能上传超过5个附件");
      return;
    }
    let uploadedListLength = props.uploadedList?.length ? props.uploadedList?.length : 0;
    if (fileList.length + uploadedListLength >= maxCount && !isRepeatMessage) {
      message.error(`最多支持${maxCount}个附件`);
      setIsRepeatMessage(true);
      return;
    }
    // 校验附件格式
    let fileTypeList = ["jpg", "jpeg", "png", "pdf"];
    let type = file.file.name.split(".")[1];

    if (!fileTypeList.includes(type)) {
      message.error("仅支持 .jpg,.jpeg,.png,.pdf 的文件");
      return;
    }
    // 大小
    if (file.file.size > 10 * 1024 * 1024) {
      message.error("仅支持 小于10M 的文件");
      return;
    }
    // 是否重名文件，重名文件不可上传
    let fileNameList = fileList.map((item) => item.name);
    if (fileNameList.includes(file.file.name)) {
      message.error("文件名重复，不可重复上传");
      return;
    }

    // 将文件加入fileList
    setFileList((list) => {
      // 这些 url 数据需要手动清空 在退出页面 和 删除文件时
      file.file.url = URL.createObjectURL(file.file);
      return list.concat(file.file);
    });
  }
  // 监听 fileList 变化 向外传递
  useEffect(() => {
    // 向外传递 新增附加以及需要删除附件的id

    props.onChange(fileList);
    // 因该从 定义数据入手 而不是现在的 自定义 ItemRender
    // 也许转发 ref 更好
  }, [fileList]);

  function onRemove(file) {
    let index = fileList.findIndex((item) => {
      return item.name === file.name;
    });
    setFileList((list) => {
      let cloneList = list.slice();
      cloneList.splice(index, 1);
      return cloneList;
    });
  }
  function onPreview(file) {
    console.log("onPreview file", file);
  }

  return (
    <>
      {/* prefix  显示已上传的文件 */}
      {props.prefix ? props.prefix : PrefixDom(props)}
      <Upload
        fileList={fileList}
        customRequest={customRequest}
        onRemove={onRemove}
        onPreview={onPreview}
        maxCount={maxCount}
        multiple
        accept=".jpg,.jpeg,.png,.pdf"
        listType={props?.listType}
        // disabled={true}
        // itemRender={ItemRender}
      >
        {props.children ? props.children : <Button icon={<UploadOutlined />}>点击上传</Button>}
      </Upload>
    </>
  );
}

function PrefixDom(props) {
  return (
    <>
      <div style={{ color: "#7d7d7d" }}>
        最多支持10份附件，支持
        <span style={{ paddingLeft: "5px", paddingRight: "5px", color: "#000" }}>.jpg,.jpeg,.png,.pdf</span>
        ，单个文件不超过<span style={{ fontWeight: 600, color: "#000" }}>10M</span>
      </div>
      <RenderUploadedFile imgUrls={props.imgUrls} imgUrl={props.imgUrl} />
    </>
  );
}

// 已上传附件回显
function RenderUploadedFile({ imgUrls = [], imgUrl = "" }) {
  // imgUrls 是url 链接数组
  let list = [];
  for (let index = 0; index < imgUrls.length; index++) {
    let item = imgUrls[index];
    if (isImg(item)) {
      list.push(
        <span
          key={index}
          style={{ display: "inline-block", verticalAlign: "bottom", margin: "0 5px 5px 0", padding: 5 }}
        >
          <img src={item} width="102" height="102" key={index} alt="" />
        </span>
      );
    } else {
      list.push(
        <a href={imgUrls[index]} target="_blank" key={index}>
          {index}.pdf
        </a>
      );
    }
  }
  return list;
}

function isImg(url) {
  let type = url.split(".").slice(-1);
  let typeList = ["png", "jpg", "jpeg"];
  return typeList.includes(type[0]);
}
