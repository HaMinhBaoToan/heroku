import React, { useEffect, useContext } from "react";
import { message, Form, Input } from "antd";
import { AppContext } from "../../../utils/AppContext";

import AuthService from "../../../services/auth.service";
import { localparseJson, parseAccessToken_res } from "../../../utils/utils";

const ChangeProfileUser = ({ setUserEmail }) => {
  const [form] = Form.useForm();
  const { userid, setnameUser, saveToken } = useContext(AppContext);

  useEffect(() => {
    AuthService()
      .getProfile({
        userId: userid,
      })
      .then((data) => {
        form.setFieldsValue({
          Email: data.data.user[0].Email,
          DislayName: data.data.user[0].DislayName,
        });
      });
  }, []);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
  };
  const onFinish = (values) => {
    AuthService()
      .editProfile({
        userId: userid,
        userName: values.DislayName,
        Email: values.Email,
      })
      .then((data) => {
        setnameUser(data.data[0].DislayName);
        if (data.data) {
          message.success("Bạn đã cập nhật thành công");
          setUserEmail(values.Email);
          const tokenString = localStorage.getItem("AcademyOnline_Token");
          const valuestoken = localparseJson(tokenString);
          AuthService()
            .refresh(valuestoken)
            .then((result) => {
              valuestoken.accessToken = result.data.accessToken;
              setnameUser(parseAccessToken_res(result.data).DislayName);
              saveToken(valuestoken);
            })
            .catch((err) => {});
        } else {
        }
      });
  };
  return (
    <>
      <div className="profile-head">
        <h3>Thay đổi thông tin</h3>
      </div>
      <div className="edit-profile">
        <Form
          {...formItemLayout}
          form={form}
          name="edit"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="DislayName"
            label={<span>Họ Và Tên</span>}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập trường này!",
                whitespace: true,
              },
            ]}
          >
            <Input className="form-control" />
          </Form.Item>
          <Form.Item
            name="Email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "Định dạng Email không chính xác!",
              },
              {
                required: true,
                message: "Vui lòng nhập trường này!",
              },
            ]}
          >
            <Input className="form-control" />
          </Form.Item>
          <Form.Item
          // wrapperCol={{
          //   xs: { span: 24, offset: 0 },
          //   sm: { span: 16, offset: 10 },
          // }}
          >
            <button
              type="primary"
              htmlType="submit"
              className="btn login-form-button"
            >
              Thay đổi thông tin
            </button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default ChangeProfileUser;
