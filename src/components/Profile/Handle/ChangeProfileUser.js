import React, { useEffect, useContext, useState } from "react";
import { message, Form, Input, Image } from "antd";
import { AppContext } from "../../../utils/AppContext";

import AuthService from "../../../services/auth.service";
import { localparseJson, parseAccessToken_res } from "../../../utils/utils";

const ChangeProfileUser = ({ setUserEmail }) => {
  const [form] = Form.useForm();
  const [imageBase64, setimageBase64] = useState();

  const {
    userid,
    setnameUser,
    saveToken,
    setimageUser,
    imageUser,
  } = useContext(AppContext);

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
   // console.log(values);
    setimageUser(values.Image)
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
          <Form.Item className="text-center">
            <Image width={200} src={imageBase64 ? imageBase64 : imageUser} />
          </Form.Item>
          <Form.Item className="text-center">
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
          </Form.Item>

          <Form.Item name="Image" style={{ display: "none" }}>
            <Input type={"hidden"} />
          </Form.Item>
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
