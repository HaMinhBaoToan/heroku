import React, { useState, useEffect } from "react";

import { Modal, Form, Input, DatePicker, Select, Alert } from "antd";

const ModalForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="Cấp tài khoảng giảng viên"
      okText="Cấp"
      cancelText="Đóng"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            // form.resetFields();
            onCreate(values);
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
          name="Email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="DislayName"
          label="Tên hiển thị:"
          rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="Telephone"
          label="Điện thoại:"
        >
          <Input />
        </Form.Item>
        <Alert message="Mật khẩu mặc định là: 123456" type="warning" />
      </Form>
    </Modal>
  );
};
export default ModalForm;
