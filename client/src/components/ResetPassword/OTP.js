import React, { useState, useEffect } from "react";
import { Modal, Form, InputNumber, Button, message } from "antd";

import AuthService from "../../services/auth.service";

const OTP = () => {
  const [form] = Form.useForm();

  const [isModalVisible, setIsModalVisible] = useState(true);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [email, setemail] = useState("");
  const onCreate = (values) => {
    if (
      values.otp1 !== "null" &&
      values.otp2 !== "null" &&
      values.otp3 !== "null" &&
      values.otp4 !== "null" &&
      values.otp5 !== "null" &&
      values.otp6 !== "null"
    ) {
      const OTP = `${values.otp1}${values.otp2}${values.otp3}${values.otp4}${values.otp5}${values.otp6}`;
      const tokenString = localStorage.getItem("AcademyOnline_Token");
      const userID = parseAccessToken(tokenString);
      AuthService()
        .checkOTPDB(userID.UsersId, OTP)
        .then((result) => {
          if (result.data) {
            setConfirmLoading(true);
            setTimeout(() => {
              setIsModalVisible(false);
              setConfirmLoading(false);
              message.success("Xác nhận OPT thành công");
              setnameUser(parseAccessToken_res(result.data).DislayName);
              saveToken(result.data);
              if (parseAccessToken_res(result.data).OTP_Confim.data[0] === 1) {
                setCheckOTPConfim(true);
              } else {
                setCheckOTPConfim(false);
              }
              setCheckLocalStorage(true);
            }, 2000);
          } else {
            message.error("Mã OTP Không khớp");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      message.error("Vui lòng nhập đầy đủ số OTP");
    }
  };

  const inputfocus = (elmnt) => {
    if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
      const next = elmnt.target.tabIndex - 2;
      if (next > -1) {
        elmnt.target.form.elements[next].focus();
      }
    } else {
      const next = elmnt.target.tabIndex;
      if (next < 6) {
        elmnt.target.form.elements[next].focus();
      }
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(null);
    }

    if (!timeLeft) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const resetOTP = () => {
    setTimeLeft(60);
    const tokenString = localStorage.getItem("AcademyOnline_Token");
    const userID = parseAccessToken(tokenString);
    AuthService()
      .updateOTP(userID.UsersId)
      .then((result) => {
        setemail(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Modal
      visible={isModalVisible}
      title="Vui lòng xác thực OTP để có thể sử dụng"
      okText="Xác Thực"
      cancelButtonProps={{ style: { display: "none" } }}
      confirmLoading={confirmLoading}
      closable={false}
      width={590}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <div>
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item name="otp1" className="otpInput">
            <InputNumber
              type="text"
              autoComplete="off"
              tabIndex="1"
              maxLength="1"
              min={0}
              onKeyUp={(e) => inputfocus(e)}
            />
          </Form.Item>
          <Form.Item name="otp2" className="otpInput">
            <InputNumber
              type="text"
              autoComplete="off"
              tabIndex="2"
              maxLength="1"
              min={0}
              onKeyUp={(e) => inputfocus(e)}
            />
          </Form.Item>
          <Form.Item name="otp3" className="otpInput">
            <InputNumber
              type="text"
              autoComplete="off"
              tabIndex="3"
              maxLength="1"
              min={0}
              onKeyUp={(e) => inputfocus(e)}
            />
          </Form.Item>
          <Form.Item name="otp4" className="otpInput">
            <InputNumber
              type="text"
              autoComplete="off"
              tabIndex="4"
              maxLength="1"
              min={0}
              onKeyUp={(e) => inputfocus(e)}
            />
          </Form.Item>
          <Form.Item name="otp5" className="otpInput">
            <InputNumber
              type="text"
              autoComplete="off"
              tabIndex="5"
              maxLength="1"
              min={0}
              onKeyUp={(e) => inputfocus(e)}
            />
          </Form.Item>
          <Form.Item name="otp6" className="otpInput">
            <InputNumber
              type="text"
              autoComplete="off"
              tabIndex="6"
              maxLength="1"
              min={0}
              onKeyUp={(e) => inputfocus(e)}
            />
          </Form.Item>
        </Form>
        <Button type="primary" className="mb-3" onClick={() => resetOTP()}>
          Lấy lại mã OTP
        </Button>
        <br />
        <h5>
          {timeLeft
            ? `Đã gửi mã đến email ${email} - vui lòng xác thực trong ${timeLeft}s`
            : ""}
        </h5>
      </div>
    </Modal>
  );
};

export default OTP;
