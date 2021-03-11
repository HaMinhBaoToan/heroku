import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  Link,
} from "react-router-dom";
import { Breadcrumb } from "antd";
import CategoryService from "../../../services/category.service";
import { AppContext } from "../../../utils/AppContext";
import Source from "./Source";
import Detail from "./Category_Detail/Detail";
const Courses = () => {
  const { userid } = useContext(AppContext);

  let { CategoryId } = useParams();
  const [datasource, setdatasource] = useState([]);
  const APIgetCategoryByUserID = () => {
    CategoryService()
      .getCatagorybyUserID(userid)
      .then(
        (response) => {
          const temp = response.data.filter((item) => item.IsActive === 1);
          setdatasource(temp);
        },
        (error) => {}
      );
  };
  useEffect(() => {
    APIgetCategoryByUserID();
  }, []);
  return (
    <div class="page-content">
      <div className="content-block">
        <div className="section-area section-sp1">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-md-4 col-sm-12">
                <div className="profile-bx text-center">
                  <div className="profile-tabnav">
                    <ul className="nav nav-tabs">
                      <li className="nav-item">
                        <Link
                          className="nav-link active"
                          data-toggle="tab"
                          //   onClick={() => setRender("FavorCourse")}
                        >
                          <i className="ti-book"></i>
                          Quản Lý Khóa Học
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="nav-link "
                          data-toggle="tab"
                          //   onClick={() => setRender("RegisteredCourse")}
                        >
                          <i className="ti-bookmark-alt"></i>
                          Quản Lý Video Khóa Học
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-4 col-sm-12">
                <Breadcrumb separator=">">
                  <Breadcrumb.Item>
                    <Link to="/">Home</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>Khóa Học</Breadcrumb.Item>
                </Breadcrumb>
                <div className="profile-content-bx">
                  <div className="tab-content">
                    <>
                      <div class="profile-head">
                        <h3> Quản Lý Khóa Học</h3>
                      </div>
                      <div class="edit-profile">
                        <Source
                          datasource={datasource}
                          APIgetCategoryByUserID={APIgetCategoryByUserID}
                        />
                      </div>
                    </>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
