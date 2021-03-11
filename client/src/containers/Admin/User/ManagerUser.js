import React, { useState, useEffect } from "react";
import UserService from "../../../services/user.service";
import { Tabs } from "antd";
import { ManagerUserContext } from "../../../utils/AppContext";

import Teacher from "./Teacher/Teacher";
import Student from "./Student/Student";

const { TabPane } = Tabs;

const ManagerUser = () => {
  const [content, setContent] = useState();


  const [datatable, setDatatable] = useState([]);
  const [datatableTemp, setDatatableTemp] = useState([]);

  useEffect(() => {
    APIgetAllUser();
  }, []);
  const APIgetAllUser = () => {
    UserService()
      .getAllUser()
      .then(
        (response) => {
          const data = [];
          for (let i = response.data.length - 1; i >= 0; i--) {
            data.push({
              key: i,
              UsersId: response.data[i].UsersId,
              Email: response.data[i].Email,
              DislayName: response.data[i].DislayName,
              Telephone: response.data[i].Telephone,
              Jobid: response.data[i].JobId,
              IsActive: response.data[i].IsActive,
              OTP: response.data[i].OTP,
              OTP_Confim: response.data[i].OTP_Confim,
              Point: response.data[i].Point,
            });
          }
          setDatatable(data);
          setDatatableTemp(data);
        },
        (error) => {
          const _content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setContent(_content);
        }
      );
  };
  const txt_Changed = function (e) {
    const temp = datatable.filter((item) =>
      item.Email.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setDatatableTemp(temp);
  };

  return (
    <ManagerUserContext.Provider
      value={{ datatableTemp, APIgetAllUser, txt_Changed,UserService }}
    >
      <Tabs type="card">
        <TabPane tab="Giảng Viên" key="1">
          <h3>{content}</h3>
          <Teacher />
        </TabPane>
        <TabPane tab="Sinh Viên" key="2">
        <h3>{content}</h3>
          <Student />
        </TabPane>
      </Tabs>
    </ManagerUserContext.Provider>
  );
};

export default ManagerUser;
