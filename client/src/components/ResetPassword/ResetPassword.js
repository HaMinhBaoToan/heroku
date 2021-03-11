import React, { useState, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Alert,
  message,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import AuthService from "../../services/auth.service";
import { AppContext } from "../../utils/AppContext";
import { parseAccessToken_res } from "../../utils/utils";

import "./resetPassword.scss";

const ResetPassword = () => {
  const {
    setnameUser,
    saveToken,
    setCheckLocalStorage,
    setCheckOTPConfim,
  } = useContext(AppContext);
  const history = useHistory();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [authenticated, setAuthenticated] = useState("");
  const [passWord, setPassWord] = useState("");
  const [selectemail, setSelect] = useState(true);
  // const [erroremail, setErrorSelect] = useState();
  const [labelText, setLabelText] = useState("");
  const [otp, setOTP] = useState("");
  const [userId, setUserId] = useState("");

  const { from } = location.state || { from: { pathname: "/" } };

  const handleInput = (event) => {
    setUserName(event.target.value);
  };
  const handleInputPassword = (event) => {
    setPassWord(event.target.value);
  };
  const inputNumber = (evt) => {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      evt.preventDefault();
    } else {
      return true;
    }
  };
  const handleInputOTP = (values) => {
    setOTP(values.target.value);
  };
  const resetPasswordUser = (values) => {
    let temp = {
      Email: userName,
      Password: passWord,
    };
    AuthService()
      .checkOTPDB(userId, otp)
      .then((result) => {
        if (result.data) {
          AuthService()
            .resetPassword(temp)
            .then((result) => {
              if (result.data) {
                AuthService()
                  .login(temp)
                  .then((res) => {
                    setnameUser(parseAccessToken_res(res.data).DislayName);

                    saveToken(res.data);
                    if (
                      parseAccessToken_res(res.data).OTP_Confim.data[0] === 1
                    ) {
                      setCheckOTPConfim(true);
                    } else {
                      setCheckOTPConfim(false);
                    }
                    setCheckLocalStorage(true);
                    history.replace(from);
                  });
              } else {
              }
            });
        } else {
          message.error("Mã OTP Không khớp");
        }
      });
  };
  const selectEmail = () => {
    let temp = {
      Email: userName,
    };
    AuthService()
      .checkEmail(temp)
      .then((res) => {
        setAuthenticated(res.data.authenticated);
        if (res.data.authenticated === true) {
          setUserId(res.data.user.UsersId);

          setSelect(false);
        } else {
          setLabelText(<Alert message="Email is not exits !!" type="error" />);
          setTimeout(() => setLabelText(), 3000);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  // const inputfocus = (elmnt) => {
  //   if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
  //     const next = elmnt.target.tabIndex - 2;
  //     if (next > -1) {
  //       elmnt.target.form.elements[next].focus();
  //     }
  //   } else {
  //     const next = elmnt.target.tabIndex;
  //     if (next < 6) {
  //       elmnt.target.form.elements[next].focus();
  //     }
  //   }
  // };

  return (
    <div className="account-form-inner">
      <div className="account-container">
        <div className="heading-bx left">
          <h2 className="title-head">
            Reset password for your <span>Account</span>
          </h2>
        </div>
        <Form>
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
              value={userName}
              onChange={handleInput}
            />
          </Form.Item>
          {!authenticated && <div className="errorText ">{labelText}</div>}

          {!selectemail && (
            <>
              <Form.Item
                style={{ display: "block" }}
                rules={[
                  {
                    required: true,
                    message: "Please input your OTP!",
                  },
                ]}
              >
                <Input
                  type="text"
                  tabIndex="1"
                  maxLength="6"
                  min={0}
                  value={otp}
                  className="mt-1 form-checkno"
                  onKeyPress={inputNumber}
                  onChange={handleInputOTP}
                  placeholder="Input OTP"
                />
              </Form.Item>
            </>
          )}
          {authenticated && (
            <Form.Item
              style={{ display: "block" }}
              name="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your new password!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                autoComplete="off"
                placeholder="New password"
                value={passWord}
                onChange={handleInputPassword}
              />
            </Form.Item>
          )}
          {selectemail && (
            <Form.Item style={{ display: "block" }}>
              <button
                type="primary"
                htmlType="submit"
                className="btn login-form-button"
                onClick={selectEmail}
              >
                Send OTP to email
              </button>
            </Form.Item>
          )}
          {!selectemail && (
            <Form.Item style={{ display: "block" }}>
              <button
                type="primary"
                htmlType="submit"
                className="btn login-form-button"
                onClick={resetPasswordUser}
              >
                Reset password
              </button>
            </Form.Item>
          )}
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
