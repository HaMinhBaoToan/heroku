import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../utils/AppContext";
import {
  useParams, Link
} from "react-router-dom";
import CoursesServices from "../../services/courses.service";
import CoursesTokenServices from "../../services/coursesToken.service";
import UserService from "../../services/user.service";
import { Breadcrumb, Button } from 'antd';
import Detail from "./Detail/Detail"
import Swal from  'sweetalert2'

const CoursesDetail = () => {

    let { CategoryId } = useParams();
    let {
      userid
    } = useContext(AppContext); 
    const [categories, setCategories] = useState('');
    const [hide, setHide] = useState(0);
    const [products, setProducts] = useState([]);
    const id = CategoryId.split("-",1);
    useEffect(() => {

      CoursesServices().CoursesDetail(id, userid != undefined ? userid : 0)
        .then((response) => {
          setCategories(response.data[0]);
          setHide(response.data[0].IsRes);
          setProducts(response.data);
        }) 
    },[userid, hide]);

    function handleClickRes() {
      if(userid == undefined) {
        Swal.fire(
          'Vui lòng đăng nhập'
        )
      }
      else {
        UserService().getUserByID(userid).
        then((response) => {
          if( (categories.Price * (100-categories.Value) /100) > response.data.Point ) {
            Swal.fire(
              `Bạn cần nạp thêm học phí   (${ ((categories.Price * (100-categories.Value) /100) - response.data.Point).toLocaleString() }đ) để đăng ký khóa học`
            )
          }
          else {
            Swal.fire({
              title: 'Bạn đồng ý đăng ký khóa học',
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Đồng ý',
              cancelButtonText: 'Hủy'
            }).then((result) => {
              if (result.isConfirmed) {
                const values = {
                  UsersId: userid,
                  CategoryId: categories.CategoryId,
                  CostEach : categories.Price * (100-categories.Value) /100
                };
                CoursesTokenServices().addRes(values).
                  then((response) => {
                    Swal.fire({
                      icon: 'success',
                      title: 'Bạn đăng ký khóa học thành công',
                      showConfirmButton: false,
                      timer: 1000
                    })
                  setHide(1);
                }) 
              }
            })
          }
            
        })
      }
    }
    return (
      <div className="page-content bg-white">
        <div className="content-block">
          <div className="section-area section-sp1">
            <div className="container">
              <div className="breadcrumb-row">
                <div className="container">
                  <div className="m-b20">
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link to="/">Trang Chủ</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                              <Link to= {`/courses/${categories.CategoryGroupId}-${categories.CategoryGroupName}` }> { categories.CategoryGroupName } </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                              { categories.CategoryName } 
                            </Breadcrumb.Item>
                        </Breadcrumb>   
                    </div>
                </div>
              </div>
              {
                hide == 0 ?
                <div className="row d-flex flex-row-reverse">
                   <div className="col-lg-3 col-md-4 col-sm-12 m-b30" >
                    <div className="course-detail-bx" >
                      <div className="course-price">
                        { categories.Value > 0
                          ? 
                          <> 
                              <del> { parseInt(categories.Price).toLocaleString() } đ </del>
                              <h4>{ (categories.Price * (100-categories.Value) /100).toLocaleString()  } đ </h4> 
                            </>
                          : <> 
                              <br></br><h4>{ parseInt(categories.Price).toLocaleString() } đ </h4> 
                            </> 
                        }
                      </div>	
                      <div className="course-buy-now text-center">
                        <Button type="primary" shape="round"  onClick={() => handleClickRes()}>
                           Đăng ký khóa học
                        </Button>
                      </div>
                      <div className="teacher-bx">
                        <div className="teacher-info">
                          <div className="teacher-thumb">
                            <img src= { categories.Ava } />
                          </div>
                          <div className="teacher-name">
                            <h5>{ categories.DislayName }</h5>
                          </div>
                        </div>
                      </div>
                      <div className="cours-more-info">
                        <div style={{width:'50%' , textAlign:'center'}}>
                          <h4> { categories.Rate }/5 <i className="fa fa-star" style={{color:'#FFFF33'}} /></h4>  
                          <span>{ categories.TotalRate } Đánh giá </span>
                        </div>
                        <div style={{width:'50%' , textAlign:'center'}}>
                          <h4> { categories.QuanRes } <i className="fa fa-user" /></h4>  
                          <span>Đã đăng ký</span>
                        </div>
                      </div>
                    </div>
                  </div>   
                  <div className="col-lg-9 col-md-8 col-sm-12">
                    <Detail  id = { id } categories={categories} products={products} />
                  </div>
                </div>
                :
                <div className="row d-flex flex-row-reverse">
                  <div className="col-lg-12 col-md-8 col-sm-12">
                    <Detail  id = { id } categories={categories} products={products} />
                  </div>
                </div>
              }
          </div>
          </div>
      </div>
    </div>
    )
}

export default CoursesDetail
