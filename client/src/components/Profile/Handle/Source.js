import React, { useState, useEffect, useContext } from "react";

import { List, Rate } from "antd";
import { formatMoney } from "../../../utils/utils";
import CategoryService from "../../../services/category.service";
import { AppContext } from "../../../utils/AppContext";

const Source = () => {
  const { userid } = useContext(AppContext);
  const [datasource, setdatasource] = useState([]);
  const APIgetCategoryByUserID = () => {
    CategoryService()
      .getCatagorybyUserID(userid)
      .then(
        (response) => {
          setdatasource(response.data);
        },
        (error) => {}
      );
  };
  useEffect(() => {
    APIgetCategoryByUserID();
  }, []);
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
              <h4>{item.CategoryName}</h4>
            </div>
            <div className="card-courses-list-bx">
              <ul className="card-courses-view">
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
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default Source;
