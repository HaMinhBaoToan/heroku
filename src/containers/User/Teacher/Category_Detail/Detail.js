import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Breadcrumb,
  Modal,
  Typography,
  Button,
  Popover,
  notification,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Player } from "video-react";

import ReactHtmlParser from "react-html-parser";
import Icon, { IconCustom } from "../../../../components/Icon";

import CategoryService from "../../../../services/category.service";
import ProductService from "../../../../services/product.service";
import ModalEdit from "./ModalEdit";
import ModalEditProduct from "./ModalEditProduct";
import ModalAddProduct from "./ModalAddProduct";

import { changeTailURL, parseForm } from "../../../../utils/utils";
const { Text } = Typography;
const { confirm } = Modal;

const Detail = () => {
  let { CategoryID } = useParams();
  const [categories, setCategories] = useState();
  const [sumvideo, setvSumvideo] = useState(0);
  const [visible, setVisible] = useState(false);
  const [visibleModalEditProduct, setvisibleModalEditProduct] = useState(false);
  const [visibleModalAddProduct, setvisibleModalAddProduct] = useState(false);

  const [ProductEdit, setProductEdit] = useState();
  const [listProduct, setlistProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingEditCategory, setLoadingEditCategory] = useState(false);

  useEffect(() => {
    getInfoCategoryByID();
  }, []);

  const getInfoCategoryByID = () => {
    CategoryService()
      .getSingleCategory(CategoryID.split("-", 1))
      .then(
        (response) => {
          console.log(response.data);
          setCategories(response.data);
          ProductService()
            .getProductByCategoryID(CategoryID.split("-", 1))
            .then((res) => {
              console.log(res.data);

              setlistProduct(res.data);
              setvSumvideo(res.data.length);
            })
            .catch((err) => {});
        },
        (error) => {}
      );
  };

  const onEdit = (values) => {
    setLoadingEditCategory(true);
    const id = values.CategoryId;
    delete values.CategoryId;

    setTimeout(() => {
      CategoryService()
        .setSingleCategory(id, values)
        .then((res) => {
          if (res.data);
          {
            getInfoCategoryByID();
            setVisible(false);
    setLoadingEditCategory(false);

          }
        })
        .catch((err) => {});
    }, 10000);
  };
  const onEditProduct = (values) => {
    const id = values.ProductId;
    delete values.ProductId;
    if (values.ChangeFile) {
      setLoading(true);

      setTimeout(() => {
        ProductService()
          .setSingleProduct(id, parseForm(values))
          .then((result) => {
            if (result.data.message) {
              getInfoCategoryByID();
              setLoading(false);
              setvisibleModalEditProduct(false);
            }
          })
          .catch((err) => {});
      }, 15000);
    } else {
      setLoading(true);

      setTimeout(() => {
        ProductService()
          .setSingleProduct(id, parseForm(values))
          .then((result) => {
            if (result.data.message) {
              getInfoCategoryByID();
              setLoading(false);
              setvisibleModalEditProduct(false);
            }
          })
          .catch((err) => {});
      }, 2000);
    }
  };
  const onAddProduct = (values, form, setshowVideo, previewVideo) => {
    if (values.File) {
      setLoadingAdd(true);
      values.CategoryID = CategoryID.split("-", 1);
      setTimeout(() => {
        ProductService()
          .addProduct(parseForm(values))
          .then((result) => {
            getInfoCategoryByID();
            setLoadingAdd(false);
            setvisibleModalAddProduct(false);
            form.resetFields();

            setshowVideo(false);
            previewVideo();
          })
          .catch((err) => {});
      }, 10000);
    } else {
      setLoadingAdd(true);
      values.CategoryID = CategoryID.split("-", 1);
      setTimeout(() => {
        ProductService()
          .addProduct(parseForm(values))
          .then((result) => {
            getInfoCategoryByID();
            setLoadingAdd(false);
            setvisibleModalAddProduct(false);
            form.resetFields();

            setshowVideo(false);
            previewVideo();
          })
          .catch((err) => {});
      }, 2000);
    }
  };

  function showDeleteConfirm(product) {
    confirm({
      title: `Bạn có chắc muốn xoá BÀI: ${product.ProductName} ?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        ProductService()
          .deleteSingleProduct(product.ProductId)
          .then((response) => {
            getInfoCategoryByID();
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
  }
  return (
    <>
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
                      Chỉnh Sửa Khóa Học
                    </Button>
                  </div>
                  <div class="teacher-bx  text-center">
                    <Button
                      shape="round"
                      type="success"
                      onClick={() => {
                        setvisibleModalAddProduct(true);
                      }}
                    >
                      {" "}
                      + Thêm video
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
                      <h2 className="post-title">
                        {" "}
                        {categories.CategoryName}{" "}
                      </h2>
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
                <div className="m-b20">
                  {/* <div className="float-left mr-5">
                  <h4>Bài học</h4>
                </div>
                <div className="ml-5">
                  <Button
                    type="primary"
                    shape="round"
                    onClick={() => {
                      setVisible(true);
                    }}
                  >
                    Thêm video
                  </Button>
                </div> */}

                  {listProduct.map((i) => (
                    <div className="panel row">
                      <div className="ttr-sidebar-navi col-10">
                        <a
                          data-toggle="collapse"
                          href={`#${i.ProductId}`}
                          className="ttr-material-button"
                          data-parent={`#${i.ProductId}`}
                        >
                          <span className="ttr-icon">
                            <i className="fa fa-book" />
                          </span>
                          <span className="ttr-label">
                            {`Bài ${
                              i.NumberNo < 10 ? "0" + i.NumberNo : i.NumberNo
                            }: ${i.ProductName}`}

                            {i.Video ? (
                              ""
                            ) : (
                              <span className="text-danger">
                                ( Bài học này chưa có video )
                              </span>
                            )}
                          </span>
                          <span className="ttr-arrow-icon">
                            <i className="fa fa-angle-down" />
                          </span>
                        </a>
                      </div>
                      <div
                        className="col-1 ttr-label "
                        style={{ alignSelf: "center" }}
                      >
                        {/* <Button
                          onClick={() => {
                            setProductEdit(i);
                            setvisibleModalEditProduct(true);
                          }}
                        >
                          <Icon component={IconCustom.Edit} />
                          Edit
                        </Button> */}
                        <Popover
                          placement="bottomRight"
                          content={
                            <div className="my-popover-container">
                              <Button
                                className="my-btn-no-style my-popover-item"
                                onClick={() => {
                                  setProductEdit(i);
                                  setvisibleModalEditProduct(true);
                                }}
                              >
                                <Icon
                                  component={IconCustom.Edit}
                                  className="my-icon-md"
                                />
                                Sửa video
                              </Button>
                              <Button
                                className="my-btn-no-style my-popover-item"
                                onClick={() => showDeleteConfirm(i)}
                              >
                                <Icon
                                  component={IconCustom.Trash}
                                  className="my-icon-md"
                                />
                                Xóa video
                              </Button>
                            </div>
                          }
                          trigger="focus"
                        >
                          <Button className="my-btn-no-style btn-icon text-dark-gray">
                            <Icon component={IconCustom.MoreHorizontal} />
                          </Button>
                        </Popover>
                      </div>
                      <div
                        id={i.ProductId}
                        className="acod-body collapse col-12"
                      >
                        {i.Video ? (
                          <Player
                            poster={changeTailURL(i.Video)}
                            src={i.Video}
                          />
                        ) : (
                          <h5 className="text-danger">
                            {" "}
                            Bài học này chưa có video
                          </h5>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <ModalEdit
                visible={visible}
                categories={categories}
                onEdit={onEdit}
                loadingEditCategory={loadingEditCategory}
                onCancel={() => {
                  setVisible(false);
                }}
              />

              <ModalEditProduct
                visibleModalEditProduct={visibleModalEditProduct}
                onEditProduct={onEditProduct}
                ProductEdit={ProductEdit}
                loading={loading}
                onCancel={() => {
                  setvisibleModalEditProduct(false);
                }}
              />
              <ModalAddProduct
                visibleModalAddProduct={visibleModalAddProduct}
                onAddProduct={onAddProduct}
                loadingAdd={loadingAdd}
                onCancel={() => {
                  setvisibleModalAddProduct(false);
                }}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default Detail;
