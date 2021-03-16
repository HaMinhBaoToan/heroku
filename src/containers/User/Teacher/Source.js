import { List, Rate, Button, notification, Typography, Modal } from "antd";
import { Link } from "react-router-dom";
import React from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { formatMoney } from "../../../utils/utils";
import CategoryService from "../../../services/category.service";

const { Text } = Typography;
const { confirm } = Modal;

const Source = ({ datasource, APIgetCategoryByUserID }) => {
  console.log(datasource);
  const deleteCategory = (category) => {
    confirm({
      title: `Bạn có chắc muốn xoá BÀI: ${category.CategoryName} ?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        CategoryService()
          .deleteSingleCatagory(category.CategoryId)
          .then((response) => {
            APIgetCategoryByUserID();
            notification["success"]({
              message: "Hoàn Tất",
              description: "bạn đã xoá thành công",
              placement: "bottomRight",
            });
          })
          .catch(function (error) {
            console.log("ERROR from server:", error);
          });
      },
      onCancel() {},
    });
  };
  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 5,
      }}
      dataSource={datasource}
      renderItem={(item) => (
        <div className="card-courses-list admin-courses">
          <div className="card-courses-media">
            <img src={item.categoryImage} alt="" />
          </div>
          <div className="card-courses-full-dec">
            <div className="card-courses-title">
              <h4>
                <Link
                  to={`/courses-edit/${item.CategoryId}-${item.CategoryName}`}
                >
                  {item.CategoryName}
                </Link>
              </h4>
              {item.Completed ? (
                <Text type="success" className="h4">
                  Hoàn Tất
                </Text>
              ) : (
                <Text type="warning" className="h4">
                  Chưa Hoàn Tất
                </Text>
              )}
            </div>
            <div className="card-courses-list-bx">
              <ul className="card-courses-view">
                <li className="card-courses-user">
                  <div className="card-courses-user-info">
                    <h5>Teacher</h5>
                    <h4>{item.NameTeacher}</h4>
                  </div>
                </li>
                <li className="card-courses-categories">
                  <h5>Categories</h5>
                  <h4>{item.CategoryGroupName}</h4>
                </li>
                <li className="card-courses-categories">
                  <h5>Joiner</h5>
                  <h4>
                    {item.QuanRes} <i className="fa fa-user" />
                  </h4>
                </li>
                <li className="card-courses-review">
                  <h5>Review</h5>
                  <Rate allowHalf disabled defaultValue={item.Rate} />{" "}
                  {item.Rate}/5
                </li>
                <li className="card-courses-price">
                  <del>{formatMoney(item.Price)}</del>
                  <h5 className="text-primary">{formatMoney(item.Price)}</h5>
                </li>
              </ul>
            </div>
            <div className="row card-courses-dec">
              <div className="col-md-12">
                <h6 className="m-b10">Course Description</h6>
                <p>{item.Note}</p>
              </div>

              <div className="col-md-12 text-right">
                <Button
                  shape="round"
                  type="danger"
                  onClick={() => {
                    deleteCategory(item);
                  }}
                >
                  Xóa Khóa học
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default Source;
