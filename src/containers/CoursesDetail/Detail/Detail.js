import React, { useState, useContext, useEffect } from "react";
import ReactHtmlParser from 'react-html-parser';
import { AppContext } from "../../../utils/AppContext";
import { Player } from 'video-react';
import Swal from 'sweetalert2'
import CoursesServices from "../../../services/courses.service";
import CoursesTokenServices from "../../../services/coursesToken.service";
import CommentCourses from "../CommentCourses/CommentCourses";
import moment from 'moment';

var dateFormat = require("dateformat");

const Detail = (props) => {

    let {
        userid
    } = useContext(AppContext);

    const [iconLike, setIconLike] = useState(0);
    const productView = [];
    const products = props.products;

    const quanRate = [props.categories.Rate1, props.categories.Rate2, props.categories.Rate3, props.categories.Rate4, props.categories.Rate5];

    useEffect(() => {
        setIconLike(props.categories.IsLike);
    }, [props.categories]);

    function handleClickNumberNo(product) {
        if (props.categories.IsRes == 0) {
            if (!product.Public) {
                Swal.fire(
                    'Yêu cầu sở hữu khóa học',
                    'Vui lòng sở hữu khóa học để xem nội này'
                )
            }
        }
        else {
            if (productView.indexOf(product.ProductId) < 0) {
                CoursesServices().updateViewVideo(product.ProductId, product.Viewer + 1)
                    .then(() => {
                        productView.push(product.ProductId);
                    })
            }
        }
    }

    function handleClickLike() {
        if (userid == undefined) {
            Swal.fire(
                'Vui lòng đăng nhập'
            )
        }
        else {
            if (iconLike == 0) {
                const values = {
                    UsersId: userid,
                    CategoryId: props.categories.CategoryId,
                    LikeTime: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
                    IsActive: true
                };
                CoursesTokenServices().addLike(values).
                    then((response) => {
                        setIconLike(1);
                    })
            }
            else {
                const values = {
                    UsersId: userid,
                    CategoryId: props.categories.CategoryId,
                    LikeTime: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
                    IsActive: false
                };
                CoursesTokenServices().delLike(values).
                    then((response) => {
                        setIconLike(0);
                    })
            }
        }
    }


    return (
        <div>
            {/* Image, Note, CategoryName */}
            <div className="courses-post" >
                <div className="ttr-post-media media-effect" >
                    <img src={props.categories.Image} />
                    <h6 style={{ margin: 10 }} >
                        <a className="m-r10" onClick={() => handleClickLike()} >
                            {
                                iconLike == 0 ?
                                    <i className="fa fa-heart-o" />
                                    :
                                    <i className="fa fa-heart" />
                            }
                        </a>
                        Thêm vào danh sách yêu thích
                    </h6>
                    <span> Cập nhật: {moment(props.categories.Update_At).format('DD/MM/YYYY')}</span>

                </div>
                <div className="ttr-post-info">
                    <div className="ttr-post-title ">
                        <h2 className="post-title"> {props.categories.CategoryName} </h2>
                    </div>
                    <div className="ttr-post-text">
                        <p style={{ textAlign: "justif" }} > {ReactHtmlParser(props.categories.Note)}</p>
                    </div>
                </div>
            </div>

            {/* Chi tiết khóa học */}

            <div className="courese-overview m-b20" >
                <h4>Lợi ích từ khóa học</h4>
                <ul className="list-checked primary">
                    {ReactHtmlParser(props.categories.Remark)}
                </ul>
            </div>

            {/* Nội dung bài học */}

            <div className="m-b20">
                <h4>Bài học</h4>
                {
                    products.map((i, index) =>
                        <div key={index} className="panel">
                            <div className="ttr-sidebar-navi">
                                <a onClick={() => handleClickNumberNo(i)} data-toggle="collapse" href={`#${i.ProductId}`} className="ttr-material-button" data-parent={`#${i.ProductId}`}>
                                    <span className="ttr-icon"> {i.Public ? <i className="fa fa-book" /> : props.categories.IsRes ? <i className="fa fa-book" /> : <i className="fa fa-lock" />} </span>
                                    <span className="ttr-label">{`Bài ${i.NumberNo < 10 ? '0' + i.NumberNo : i.NumberNo}: ${i.ProductName}`}</span>
                                    <span className="ttr-arrow-icon"><i className="fa fa-angle-down" /></span>
                                </a>
                            </div>
                            <div id={i.Public ? i.ProductId : props.categories.IsRes ? i.ProductId : "lock"} className="acod-body collapse">
                                <Player>
                                    <source src={i.Video} />
                                </Player>
                            </div>
                        </div>
                    )
                }
            </div>

            {/* Thông tin giảng viên */}

            <div className="m-b30">
                <h4>Thông tin giảng viên</h4>
                <div className="instructor-bx">
                    <div className="instructor-author"  >
                        <img src={props.categories.Ava} />
                    </div>
                    <div className="instructor-info">
                        <h3 className="m-t30"> {props.categories.DislayName} </h3>
                        {ReactHtmlParser(props.categories.TeacherNote)}
                    </div>
                </div>
            </div>
            {/* Đánh giá */}
            <CommentCourses quanRate={quanRate} categories={props.categories} />
        </div>
    )
}


export default Detail
