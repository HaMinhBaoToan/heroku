import React, { useState, useContext } from "react";
import { Form, Input, Alert } from "antd";

import { AppContext } from "../../../utils/AppContext";

import AuthService from "../../../services/auth.service";

const ChangePassword = ({ userEmail }) => {
  //const { userid } = useContext(AppContext);
  const [form] = Form.useForm();
  const [labelText, setLabelText] = useState("");

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
  };

  const onFinish = (values) => {
    let data = {
      Email: userEmail,
      CurrentPassword: values.PasswordOld,
      NewPassword: values.Password,
    };
    AuthService()
      .changePassword(data)
      .then((data) => {
        console.log(data);
        if (data.data) {
          setLabelText(
            <Alert message="Thay đổi mật khẩu thành công!" type="success" />
          );
          setTimeout(() => setLabelText(), 3000);
          form.resetFields();
        } else {
          setLabelText(
            <Alert message="Mật khẩu cũ không đúng !" type="error" />
          );
          setTimeout(() => setLabelText(), 3000);
        }
      });
    // AuthService()
    //   .checkPassword({
    //     UsersId: userid,
    //     Password: values.PasswordOld,
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     if (!res.data) {
    //       setLabelText(
    //         <Alert message="Mật khẩu cũ không đúng !" type="error" />
    //       );
    //       setTimeout(() => setLabelText(), 3000);
    //     } else {
    //       message.success("Thay đổi mật khẩu thành công");
    //     }
    //   });
  };
  return (
    <>
      <div class="profile-head">
        <h3>Thay Đổi Mật Khẩu</h3>
      </div>
      <div class="edit-profile">
        <Form
          {...formItemLayout}
          form={form}
          name="changePassword"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="PasswordOld"
            label="Mật khẩu hiện tại"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập trường này!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("PasswordOld") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Hai mật khẩu bạn đã nhập khớp!");
                },
              }),
            ]}
          >
            <Input className="form-control" />
          </Form.Item>

          <Form.Item
            name="Password"
            label="Mật khẩu mới"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập trường này!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("PasswordOld") !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Hai mật khẩu bạn đã nhập khớp!");
                },
              }),
            ]}
            hasFeedback
          >
            <Input className="form-control" />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Nhập lại mật khẩu mới"
            dependencies={["Password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Vui lòng nhập trường này!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("Password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Hai mật khẩu bạn đã nhập không khớp!");
                },
              }),
            ]}
          >
            <Input className="form-control" />
          </Form.Item>
          <div className="errorText my-3">{labelText}</div>
          <Form.Item>
            <button
              type="primary"
              htmlType="submit"
              className="btn login-form-button"
            >
              Thay đổi mật khẩu
            </button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default ChangePassword;
