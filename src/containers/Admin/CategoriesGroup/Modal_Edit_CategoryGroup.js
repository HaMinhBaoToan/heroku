import React, { useState, useEffect } from "react";

import { Modal, Form, Input, Image } from "antd";

const ModalForm = ({ visibleModalEdit, onEdit, onCancel, categoryGroupEditModal }) => {
  const [form] = Form.useForm();
  const [imageBase64, setimageBase64] = useState();
  useEffect(() => {
    setimageBase64(categoryGroupEditModal.Image);
    form.setFieldsValue({
      CategoryGroupId: categoryGroupEditModal.CategoryGroupId,
      CategoryGroupName: categoryGroupEditModal.CategoryGroupName,
      Image: categoryGroupEditModal.Image,
    });
  }, [categoryGroupEditModal])
  return (
    <Modal
      visible={visibleModalEdit}
      title="Sửa Lĩnh Vực"
      okText="Sửa"
      cancelText="Đóng"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onEdit(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        <Form.Item
          name="CategoryGroupName"
          label="Tên Lĩnh Vực"
          rules={[
            {
              required: true,
              message: "Please input your ...",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Image width={200} src={imageBase64} />
        <input
          className="inputFile"
          type="file"
          accept="image/jpeg"
          onChange={(e) => {
            var reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onloadend = function (event) {
              var base64Data = event.target.result;
              setimageBase64(base64Data);
              form.setFieldsValue({
                Image: base64Data,
              });
            };
          }}
        />
        <Form.Item name="Image" style={{ display: "none" }}>
          <Input type={"hidden"} />
        </Form.Item>
        <Form.Item name="CategoryGroupId" style={{ display: "none" }}>
          <Input type={"hidden"} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ModalForm;
