import React, { useState } from "react";

import { Modal, Form, Input, Image } from "antd";

const ModalForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [imageBase64, setimageBase64] = useState();

  return (
    <Modal
      visible={visible}
      title="Thêm lĩnh vực"
      okText="Thêm"
      cancelText="Đóng"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
            setimageBase64();

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
          name="CategoryGroupname"
          label="Tên Lĩnh Vực"
          rules={[
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Image width={200} src={imageBase64} />
        <input
          className="inputFile"
          type="file"
          accept="image/*"
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
      </Form>
    </Modal>
  );
};
export default ModalForm;
