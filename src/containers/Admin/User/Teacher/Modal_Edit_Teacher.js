import React, { useEffect } from "react";

import { Modal, Form, Input } from "antd";

const ModalForm = ({ visibleModalEdit, onEdit, onCancel, userEditModal }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      UsersId: userEditModal.UsersId,
      Email: userEditModal.Email,
      DislayName: userEditModal.DislayName,
      Telephone: userEditModal.Telephone,
    });
  }, [userEditModal,form])
  return (
    <Modal
      visible={visibleModalEdit}
      title="Sửa tài khoản giảng viên"
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
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        <Form.Item name="UsersId" style={{ display: "none" }}>
          <Input type={"hidden"} />
        </Form.Item>
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
          rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}

        >
          <Input />
        </Form.Item>
      </Form>
    </Modal >
  );
};
export default ModalForm;
