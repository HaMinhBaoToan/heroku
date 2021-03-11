import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Breadcrumb, Modal, Typography, Button } from "antd";
import ReactHtmlParser from "react-html-parser";

import CategoryService from "../../../../services/category.service";
import ProductService from "../../../../services/product.service";
import ModalEdit from "./ModalEdit";
const { Text } = Typography;

const Detail = () => {
  let { CategoryID } = useParams();
  const [categories, setCategories] = useState();
  const [sumvideo, setvSumvideo] = useState(0);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    getInfoCategoryByID();
  }, []);

  const getInfoCategoryByID = ()=>{
    CategoryService()
    .getSingleCategory(CategoryID.split("-", 1))
    .then(
      (response) => {
        setCategories(response.data);
        ProductService()
          .getProductByCategoryID(response.data.CategoryId)
          .then((res) => {
            setvSumvideo(res.data.length);
          })
          .catch((err) => {});
      },
      (error) => {}
    );
  }
  // const Edit = () => {
  //   setVisible(true)
  //   console.log("object");
  // };

  const onEdit = (values) => {
    console.log(values);
    const id = values.CategoryId;
    delete values.CategoryId;
    CategoryService()
    .setSingleCategory(id,values)
    .then((res) => {
     console.log(res.data);
     getInfoCategoryByID();
    })
    .catch((err) => {});
    setVisible(false);
  };
  return (
    <div className="page-content bg-white">
      <div class="breadcrumb-row">
        <div class="container">
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/manager/course">Quản Lý Khóa Học</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{CategoryID.split("-", 2)[1]}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="container mt-5">
        {categories ? (
          <div className="row d-flex flex-row-reverse">
            <div className="col-lg-3 col-md-4 col-sm-12 m-b30">
              <div className="course-detail-bx">
                <div className="course-price">
                  <h3 className="text-red">
                    {parseInt(categories.Price).toLocaleString()} đ
                  </h3>
                  {categories.Completed ? (
                    <Text type="success" className="h4">
                      Hoàn Tất
                    </Text>
                  ) : (
                    <Text type="warning" className="h4">
                      Chưa Hoàn Tất
                    </Text>
                  )}
                </div>
                <h5 className="mt-1 text-center">
                  Video: {sumvideo}/{categories.VideoQuantity}
                </h5>
                <div class="text-center">
                  <h5>Danh mục</h5>
                  <span>{categories.CategoryGroupName}</span>
                </div>
                <div className="course-buy-now text-center mt-3">
                  <Button
                    type="primary"
                    shape="round"
                    onClick={() => {
                      setVisible(true);
                    }}
                  >
                    Chỉnh Sửa
                  </Button>
                </div>
              </div>
            </div>
            <div className="col-lg-9 col-md-8 col-sm-12">
              <div className="courses-post">
                <div className="ttr-post-media media-effect">
                  <img src={categories.categoryImage}></img>
                </div>
                <div className="ttr-post-info">
                  <div className="ttr-post-title ">
                    <h2 className="post-title"> {categories.CategoryName} </h2>
                  </div>
                  <div className="ttr-post-text">
                    <p>{categories.Note}</p>
                  </div>
                </div>
              </div>
              <div className="courese-overview m-b20">
                <h2>Lợi ích từ khóa học</h2>
                {ReactHtmlParser(categories.Remark)}
              </div>
            </div>
            <ModalEdit
              visible={visible}
              categories={categories}
              onEdit={onEdit}
              onCancel={() => {
                setVisible(false);
              }}
            />
          </div>
        ) : (
          ""
        )}
      </div>
      {/* <Modal
        title="Modal 1000px width"
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal> */}
    </div>
  );
};

export default Detail;
