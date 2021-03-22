import React, { useState, useContext } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { Form, Input, Button, Alert } from "antd";

import AuthService from "../../services/auth.service";
import { AppContext } from "../../utils/AppContext";
import { parseAccessToken_res } from "../../utils/utils";
import { GoogleLogin } from 'react-google-login';

import "./register.scss";
var dateFormat = require("dateformat");

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const Register = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const location = useLocation();
  const [labelText, setLabelText] = useState("");
  const { from } = location.state || { from: { pathname: "/" } };

  const {
    setnameUser,
    setimageUser,
    saveToken,
    setCheckLocalStorage,
    setCheckOTPConfim,
    setUserJobId,
    setUserid,
    setProfile,
  } = useContext(AppContext);

  const onFinish = (values) => {
    delete values.confirm;
    values.Created_at = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    AuthService()
      .register(values)
      .then((res) => {
        var confirm = res.status;
        if (confirm === 204) {
          setLabelText(
            <Alert
              message="Email đã được sử dụng!! Vui lòng chọn một Email khác"
              type="error"
            />
          );
          setTimeout(() => setLabelText(), 3000);
        } else {
          AuthService()
            .login(values)
            .then((res) => {
              setnameUser(parseAccessToken_res(res.data).DislayName);
              setimageUser(parseAccessToken_res(res.data).Image);
              setUserid(parseAccessToken_res(res.data).UsersId);
              setProfile(parseAccessToken_res(res.data).Users);
              setUserJobId(parseAccessToken_res(res.data).JobId)
              saveToken(res.data);
              if (parseAccessToken_res(res.data).OTP_Confim.data[0] === 1) {
                setCheckOTPConfim(true);
              } else {
                setCheckOTPConfim(false);
              }
              setCheckLocalStorage(true);
              history.replace(from);
            })
            .catch((err) => {
              console.log("err", err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const responseSuccessGoogle = (response) => {
    var values = {};
    values.Created_at = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    values.Email = response.profileObj.email;
    values.Image = response.profileObj.imageUrl;
    values.DislayName = response.profileObj.name;
    AuthService()
      .registerWithGoogle(values)
      .then((res) => {
        var confirm = res.status;
        if (confirm === 204) {
          setLabelText(
            <Alert
              message="Email đã được sử dụng!! Vui lòng chọn một Email khác"
              type="error"
            />
          );
          setTimeout(() => setLabelText(), 3000);
        } else {
          AuthService()
            .loginWithGoogle(values)
            .then((res) => {
              setnameUser(parseAccessToken_res(res.data).DislayName);
              setimageUser(parseAccessToken_res(res.data).Image);
              setUserid(parseAccessToken_res(res.data).UsersId);
              setProfile(parseAccessToken_res(res.data).Users);
              setUserJobId(parseAccessToken_res(res.data).JobId)
              saveToken(res.data);
              if (parseAccessToken_res(res.data).OTP_Confim.data[0] === 1) {
                setCheckOTPConfim(true);
              } else {
                setCheckOTPConfim(false);
              }
              setCheckLocalStorage(true);
              history.replace(from);
            })
            .catch((err) => {
              console.log("err", err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const responseErrorGoogle = (response) => {
    console.log(response);
  }
  return (
    <div className="account-form-inner">
      <div className="account-container">
        <div className="heading-bx left">
          <h2 className="title-head">
            Sign Up <span>Now</span>
          </h2>
          <p>
            Login Your Account
                <Link to="/login"> Click here </Link>
          </p>
        </div>
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            prefix: "84",
          }}
          scrollToFirstError
        >
          <Form.Item
            name="DislayName"
            label={<span>Nickname&nbsp;</span>}
            rules={[
              {
                required: true,
                message: "Please input your nickname!",
                whitespace: true,
              },
            ]}
          >
            <Input />
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
            name="Password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["Password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("Password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    "The two passwords that you entered do not match!"
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Register
                </Button>
          </Form.Item>
        </Form>
        <GoogleLogin
          clientId="2439593696-itguu1n7cadvq75k3611al1f2lf17nc2.apps.googleusercontent.com"
          buttonText="Register With Google"
          onSuccess={responseSuccessGoogle}
          onFailure={responseErrorGoogle}
          cookiePolicy={'single_host_origin'}
        />
        <div className="errorText ">{labelText}</div>
      </div>
    </div>
  );
};

export default Register;
