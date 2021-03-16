import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  SearchOutlined,
  LockOutlined,
  UnlockOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";

import { Table, Button, notification, Input, Row, Col, Popover, Modal, Tag } from "antd";
import Icon, { IconCustom } from "../../../../components/Icon";

import ModalForm from "./Modal_Input_Teacher";
import ModalEdit from "./Modal_Edit_Teacher";


import { localparseJson } from "../../../../utils/utils";
import { ManagerUserContext } from "../../../../utils/AppContext";
const { confirm } = Modal;

var dateFormat = require("dateformat");

const Teacher = () => {
  const { datatableTemp, APIgetAllUser, txt_Changed, UserService } = useContext(ManagerUserContext);

  const [data, setdata] = useState();
  const [visibleModalEdit, setVisibleModalEdit] = useState(false);
  const [userEditModal, setuserEditModal] = useState({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const temp = datatableTemp.filter((item) => item.Jobid === 3);
    setdata(temp);
  }, [datatableTemp]);
  const columns = [
    {
      title: "ID",
      dataIndex: "UsersId",
      width: 50,
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "Email",
      width: 50,
      align: "center",
    },
    {
      title: "Display Name",
      dataIndex: "DislayName",
      width: 50,
      align: "center",
    },
    {
      title: "Điện thoại",
      dataIndex: "Telephone",
      width: 50,
      align: "center",

    },
    {
      title: "Point",
      dataIndex: "Point",
      width: 50,
      align: "center",

    },
    {
      title: "Khóa",
      dataIndex: "IsActive",
      width: 100,
      align: "center",
      key: "IsActive",

      render: (IsActive, user) => (
        <>
          {IsActive ? (
            <Button
              type="primary"
              shape="round"
              onClick={() => handleProduct(user, false, true, false)}
              icon={<UnlockOutlined />}
            />
          ) : (
              <Button
                type="default"
                shape="round"
                onClick={() => handleProduct(user, true, false, false)}
                icon={<LockOutlined />}
              />
            )}
        </>
      ),
    },
    {
      title: "OTP",
      dataIndex: "OTP",
      width: 50,
      align: "center",

    },
    {
      title: "Xác nhận OTP",
      dataIndex: "OTP_Confim",
      width: 50,
      align: "center",
      render: (OTP_Confim, user) => (
        <>
          {OTP_Confim.data[0] ? (
            <Tag color="green" key={user.key}>
              Đã xác thực
            </Tag>
          ) : (
              <Tag color="gold" key={user.key}>
                Chưa xác thực
              </Tag>
            )}
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "User_Edit",
      align: "center",
      key: "User_Edit",
      className: "actions",
      width: 50,
      render: (User_Edit, user) => (
        <>
          <Popover
            placement="bottomRight"
            content={
              <div className="my-popover-container">
                <Button
                  className="my-btn-no-style my-popover-item"
                  onClick={() => {
                    setVisibleModalEdit(true);
                    setuserEditModal(user);
                  }}
                >
                  <Icon component={IconCustom.Edit} className="my-icon-md" />
                  Edit
                </Button>
                <Button
                  className="my-btn-no-style my-popover-item"
                  onClick={() => showDeleteConfirm(user)}
                >
                  <Icon component={IconCustom.Trash} className="my-icon-md" />
                  Remove
                </Button>
              </div>
            }
            trigger="focus"
          >
            <Button className="my-btn-no-style btn-icon text-dark-gray">
              <Icon component={IconCustom.MoreHorizontal} />
            </Button>
          </Popover>
        </>
      ),
    },

  ];
  function showDeleteConfirm(user) {
    confirm({
      title: `Bạn có chắc muốn xoá ${user.Email} ?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        UserService().deleteSingleUser(user.UsersId)
          .then((response) => {
            APIgetAllUser();
            notification["success"]({
              message: "Hoàn Tất",
              description: "bạn đã xoá thành công",
            });
          })
          .catch(function (error) {
            console.log("ERROR from server:", error);
          });
      },
      onCancel() { },
    });
  }
  const onEdit = (values) => {
    handleProduct(values, false, false, true);
    setVisibleModalEdit(false);
  };
  const handleProduct = (user, setEnable, setDisable, upDateUser) => {
    if (setEnable === true) {
      UserService()
        .setSingleUser(user.UsersId, {
          ...user,
          IsActive: 1,

        })
        .then((response) => {
          APIgetAllUser();
          notification["success"]({
            message: "Hoàn Tất",
            description: "Bạn đã sửa thành công",
          });
        })
        .catch(function (error) {
          console.log("ERROR from server:", error);
        });
    }
    if (setDisable === true) {
      UserService()
        .setSingleUser(user.UsersId, {
          ...user,
          IsActive: 0,
        })
        .then((response) => {
          APIgetAllUser();
          notification["success"]({
            message: "Hoàn Tất",
            description: "Bạn đã sửa thành công",
          });
        })
        .catch(function (error) {
          console.log("ERROR from server:", error);
        });
    }
    if (upDateUser === true) {
      var id = user.UsersId;
      delete user.UsersId;
      UserService()
        .setSingleUser(id, {
          ...user
        })
        .then((response) => {
          APIgetAllUser();
          notification["success"]({
            message: "Hoàn Tất",
            description: "Bạn đã sửa thành công",
          });

        })
        .catch(function (error) {
          console.log("ERROR from server:", error);
        });
    }
  };
  const onCreate = (values) => {
    values.Created_at = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    axios
      .post("/api/users/teacher", values, {
        headers: {
          "x-access-token": localparseJson(
            localStorage.getItem("AcademyOnline_Token")
          ).accessToken,
        },
      })
      .then((response) => {
        if (response.status === 204) {
          notification["error"]({
            message: "Không thành công",
            description: `Tài khoản đã tồn tại`,
          });
        } else {
          notification["success"]({
            message: "Hoàn Tất",
            description: `Bạn vừa thêm thành công`,
          });
          setVisible(false);
          APIgetAllUser();
        }
      })
      .catch(function (error) {
        console.log("ERROR from server:", error);
      });
  };

  return (
    <>
      <Row>
        <Col span={12}>
          <Input
            placeholder="Mã sản phẩm, tên sản phẩm"
            onChange={(e) => txt_Changed(e)}
            size="large"
            prefix={
              <SearchOutlined style={{ fontSize: "16px", color: "#a3a3a3" }} />
            }
            style={{ borderRadius: 8 }}
            allowClear
          />
        </Col>
        <Col span={12}>
          <Button
            className="float-right"
            type="success"
            onClick={() => {
              setVisible(true);
            }}
          >
            + Cấp tài khoản giảng viên
          </Button>
        </Col>
      </Row>

      <ModalForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
      <ModalEdit
        visibleModalEdit={visibleModalEdit}
        userEditModal={userEditModal}
        onEdit={onEdit}
        onCancel={() => {
          setVisibleModalEdit(false);
        }}
      />
      <Table
        style={{ paddingTop: "30px" }}
        size="small"
        columns={columns}
        dataSource={data}
        scroll={{ x: 768 }}
      />

    </>
  );
};

export default Teacher;
