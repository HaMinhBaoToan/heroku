import React, { useState, useContext } from "react";
import {
  Form,
  Input, //Button,
  Checkbox,
  Alert,
  notification,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useHistory, useLocation } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import AuthService from "../../services/auth.service";
import { AppContext } from "../../utils/AppContext";
import { parseAccessToken_res } from "../../utils/utils";

import "antd/dist/antd.css";
import "./login.scss";

const Login = () => {
  const {
    setnameUser,
    setimageUser,
    saveToken,
    setCheckLocalStorage,
    setCheckOTPConfim,
    setUserid,
    setProfile,
    setUserJobId,
  } = useContext(AppContext);

  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  const [labelText, setLabelText] = useState("");

  const responseSuccessGoogle = (response) => {
    var values = {};
    values.Email = response.profileObj.email;
    AuthService()
      .loginWithGoogle(values)
      .then((res) => {
        if (res.data.IsActive === false) {
          setLabelText(
            <Alert
              message="Tài Khoản của bạn tạm thời bị khóa, vui lòng liên hệ admin để mở !!"
              type="error"
            />
          );
          setTimeout(() => setLabelText(), 3000);
        } else {
          const { authenticated } = res.data;
          if (authenticated) {
            setnameUser(parseAccessToken_res(res.data).DislayName);
            setimageUser(parseAccessToken_res(res.data).Image);
            setUserid(parseAccessToken_res(res.data).UsersId);
            setProfile(parseAccessToken_res(res.data).Users);
            setUserJobId(parseAccessToken_res(res.data).JobId);
            saveToken(res.data);
            const ws = new WebSocket("ws://localhost:40567");

            ws.onopen = function () {
              console.log("connected");
              ws.send(parseAccessToken_res(res.data).UsersId);
            };
            ws.onmessage = function (e) {
              if (e.data) {
                var c = JSON.parse(e.data);
                notification["warning"]({
                  message: "Thông Báo",
                  description: `Giảng Viên: ${
                    c.DislayName && c.DislayName
                  } Vừa Cập Nhật Khóa Học: ${c.CategoryName && c.CategoryName}`,
                  placement: "bottomRight",
                });
              }
            };

            if (parseAccessToken_res(res.data).OTP_Confim.data[0] === 1) {
              setCheckOTPConfim(true);
            } else {
              setCheckOTPConfim(false);
            }
            setCheckLocalStorage(true);
            setLabelText(<Alert message="ok !!" type="success" />);
            history.replace(from);
          } else {
            setLabelText(
              <Alert message="Email or Password is incorrect !!" type="error" />
            );
            setTimeout(() => setLabelText(), 3000);
          }
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  const responseErrorGoogle = (response) => {
    console.log(response);
  };
  const onFinish = (values) => {
    AuthService()
      .login(values)
      .then((res) => {
        if (res.data.IsActive === false) {
          setLabelText(
            <Alert
              message="Tài Khoản của bạn tạm thời bị khóa, vui lòng liên hệ admin để mở !!"
              type="error"
            />
          );
          setTimeout(() => setLabelText(), 3000);
        } else {
          const { authenticated } = res.data;
          if (authenticated) {
            setUserJobId(parseAccessToken_res(res.data).JobId);
            setnameUser(parseAccessToken_res(res.data).DislayName);
            setimageUser(parseAccessToken_res(res.data).Image);
            setUserid(parseAccessToken_res(res.data).UsersId);
            const ws = new WebSocket("ws://localhost:40567");

            ws.onopen = function () {
              console.log("connected");
              ws.send(parseAccessToken_res(res.data).UsersId);
            };
            ws.onmessage = function (e) {
              if (e.data) {
                var c = JSON.parse(e.data);
                notification["warning"]({
                  message: "Thông Báo",
                  description: `Giảng Viên: ${
                    c.DislayName && c.DislayName
                  } Vừa Cập Nhật Khóa Học: ${c.CategoryName && c.CategoryName}`,
                  placement: "bottomRight",
                });
              }
            };
            saveToken(res.data);
            if (parseAccessToken_res(res.data).OTP_Confim.data[0] === 1) {
              setCheckOTPConfim(true);
            } else {
              setCheckOTPConfim(false);
            }
            setCheckLocalStorage(true);
            setLabelText(<Alert message="ok !!" type="success" />);
            history.replace(from);
          } else {
            setLabelText(
              <Alert message="Email or Password is incorrect !!" type="error" />
            );
            setTimeout(() => setLabelText(), 3000);
          }
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <div className="account-form-inner">
      <div className="account-container">
        <div className="heading-bx left">
          <h2 className="title-head">
            Login to your <span>Account</span>
          </h2>
          <p>
            Don't have an account?  {" "}
            <Link to="/register">Create one here </Link>
          </p>
        </div>
        <Form
          name="normal_login"
          className="contact-bx"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="Email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="Password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item className="float-right">
              <Link style={{ color: "#4E4BF9", textDecoration: "underline" }}>
                <Link to="/resetPassword">Forgot your password? </Link>
              </Link>
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <button
              type="primary"
              htmlType="submit"
              className="btn btn-md login-form-button"
            >
              Log in
            </button>
          </Form.Item>
        </Form>
        <div className="errorText ">{labelText}</div>
        <div className="row placeani mt-4">
          <div className="col-lg-12">
            <h6>Login with Social media</h6>
            <div className="d-flex">
              {/* <Link className="btn flex-fill m-r5 facebook" to="/">
                <i className="fa fa-facebook"></i>Facebook
              </Link>
              <Link className="btn flex-fill m-l5 google-plus" to="/">
                <i className="fa fa-google-plus"></i>Google Plus
              </Link> */}
              <GoogleLogin
                clientId="2439593696-itguu1n7cadvq75k3611al1f2lf17nc2.apps.googleusercontent.com"
                buttonText="Login With Google"
                onSuccess={responseSuccessGoogle}
                onFailure={responseErrorGoogle}
                cookiePolicy={"single_host_origin"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
