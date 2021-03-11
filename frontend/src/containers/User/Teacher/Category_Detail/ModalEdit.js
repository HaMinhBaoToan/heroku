import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState, ContentState } from "draft-js";
import { Modal, Form, Input, Image, Radio, InputNumber, Select } from "antd";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import CategorygroupService from "../../../../services/categorygroup.service";
const { Option } = Select;

const ModalEdit = ({ visible, categories, onEdit, onCancel }) => {
  const [editorState, seteditorState] = useState();
  const [listCategoryGroup, setlistCategoryGroup] = useState([]);

  const [imageBase64, setimageBase64] = useState();
  const [changeIMG, setchangeIMG] = useState(false);

  function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  const [form] = Form.useForm();

  useEffect(() => {
    // toDataURL(categories.categoryImage, function (dataUrl) {
    //     setimageBase64(dataUrl);
    //   });
    const contentBlock = htmlToDraft(categories.Remark);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorStatetemp = EditorState.createWithContent(contentState);
      seteditorState(editorStatetemp);
    }
    CategorygroupService()
      .getAllCategorygroup()
      .then((res) => {
        setlistCategoryGroup(res.data);
      })
      .catch((err) => {});
    form.setFieldsValue({
      CategoryId: categories.CategoryId,
      CategoryName: categories.CategoryName,
      Note: categories.Note,
      Remark: categories.Remark,
      Completed: categories.Completed,
      VideoQuantity: categories.VideoQuantity,
      Price: categories.Price,
      CategoryGroupId: [categories.CategoryGroupId],
      Image: categories.categoryImage,
      Change: false
    });
  }, [categories]);

  const onEditorStateChange = (editorState) => {
    seteditorState(editorState);
    form.setFieldsValue({
      Remark: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    });
  };
  return (
    <Modal
      width={1000}
      visible={visible}
      title="Sửa Thông Tin Khóa Học"
      okText="Sửa"
      cancelText="Đóng"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onEdit(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item name="CategoryId" style={{ display: "none" }}>
          <Input type={"hidden"} />
        </Form.Item>

        <Form.Item
          name="CategoryName"
          label="Tên Khóa Học"
          rules={[
            {
              required: true,
              message: "Please input...",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="CategoryGroupId"
          label="Danh mục: "
          rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
        >
          <Select
            showSearch
            placeholder="Chọn danh mục"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {listCategoryGroup.map((item, index) => (
              <Option key={index} value={item.CategoryGroupId}>
                {item.CategoryGroupName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="Price"
          label="Giá : "
          rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
        >
          <InputNumber
            style={{ width: "-webkit-fill-available" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>
        <Form.Item name="Note" label="Mô Tả Ngắn">
          <Input />
        </Form.Item>

        <Form.Item name="Remark" style={{ display: "none" }}>
          <Input />
        </Form.Item>

        <Form.Item
          name="VideoQuantity"
          label="Số lượng video của khóa: "
          rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
        >
          <InputNumber
            min={1}
            max={100}
            style={{ width: "-webkit-fill-available" }}
          />
        </Form.Item>
        <Form.Item
          name="Completed"
          label="Trạng Thái"
          rules={[{ required: true, message: "Please pick an item!" }]}
        >
          <Radio.Group size="middle">
            <Radio.Button style={{ color: "#52c41a" }} value={1}>
              Hoàn Tất
            </Radio.Button>
            <Radio.Button style={{ color: "#faad14" }} value={0}>
              Chưa Hoàn Tất
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName bg-light "
          onEditorStateChange={onEditorStateChange}
        />
        {!changeIMG ? <Image width={400} src={categories.categoryImage} /> : <Image width={400} src={imageBase64} />}

        <input
          className="inputFile"
          type="file"
          accept="image/*"
          onChange={(e) => {
            var reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onloadend = function (event) {
              var base64Data = event.target.result;
              console.log(base64Data)
              setimageBase64(base64Data);
              setchangeIMG(true);
              form.setFieldsValue({
                Image: base64Data,
                Change: true
              });
            };
          }}
        />
        <Form.Item name="Image" style={{ display: "none" }}>
          <Input type={"hidden"} />
        </Form.Item>
        <Form.Item name="Change" style={{ display: "none" }}>
          <Input type={"hidden"} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEdit;
