import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Pagination, Checkbox } from 'antd';
import { useEffect } from "react";
import CoursesTokenServices from "../../../services/coursesToken.service";
var dateFormat = require("dateformat");

const CoursesList = (props) => {

    const numEachPage = 6;
    const [defaultCurrent, setDefaultCurrent] = useState(1);
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(numEachPage);
    const [categories, setCategories] = useState(props.categories.slice());


    useEffect(() => {
        setMinValue(0);
        setMaxValue(numEachPage);
        setDefaultCurrent(1);
        setCategories(props.categories.slice());
    }, [props.categories])

    const handleChange = (value) => {
        setMinValue((value - 1) * numEachPage);
        setMaxValue(value * numEachPage);
        setDefaultCurrent(value);
    };

    const handleClickUnlike = (CategoryId) => {
        const values = {
            UsersId: props.userid,
            CategoryId: CategoryId,
            LikeTime: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
            IsActive: false
        };
        CoursesTokenServices().delLike(values).
            then((response) => {
                setCategories(categories.filter(data => (
                    data.CategoryId != CategoryId)))
                setMinValue(0);
                setMaxValue(numEachPage);
            })
    }

    function onChange(e) {
        if (e.target.checked === true) {
            const values = {
                UsersId: props.userid,
                CategoryId: e.target.id,
                IsDone: true
            };
            CoursesTokenServices().updateDoneRes(values).
                then((response) => {
                    if (props.filter !== undefined) {
                        setCategories(categories.filter(data => (
                            data.CategoryId != e.target.id)))
                    }
                    categories[categories.findIndex(value => value.CategoryId === e.target.id)].IsDone = 1;
                })

        }
        else {
            const values = {
                UsersId: props.userid,
                CategoryId: e.target.id,
                IsDone: false
            };
            CoursesTokenServices().updateDoneRes(values).
                then((response) => {
                    if (props.filter !== undefined) {
                        setCategories(categories.filter(data => (
                            data.CategoryId != e.target.id)))
                    }
                    categories[categories.findIndex(value => value.CategoryId === e.target.id)].IsDone = 0;
                })
        }
    };


    return (
        <>
            {
                categories.length == 0
                    ?
                    <div style={{ fontSize: '50px', textAlign: 'center' }}>
                        <i className="fa fa-search" />
                        <h1> Không tìm thấy khóa học nào </h1>
                    </div>
                    :
                    <div className="row">
                        {
                            categories.slice(minValue, maxValue).map((val) =>
                                <div key={val.CategoryId} className="col-md-6 col-lg-4 col-sm-6 m-b30">
                                    <div className="cours-bx">
                                        <div className="action-box">
                                            <Link to={`/courses/${val.CategoryGroupId}-${val.CategoryGroupName}/${val.CategoryId}-${val.CategoryName}`} >
                                                <img src={val.Image} />
                                            </Link>
                                        </div>
                                        <div className="info-bx text-center" style={{ height: '125px' }}>
                                            <h5><Link to={`/courses/${val.CategoryGroupId}-${val.CategoryGroupName}/${val.CategoryId}-${val.CategoryName}`} >{val.CategoryName}</Link></h5>
                                            <span> {val.CategoryGroupName} </span>
                                            {props.unlikeUserId ?
                                                <span style={{ color: 'red', fontWeight: 'bold', bottom: 5, position: 'absolute', left: 5 }} >
                                                    <Button type="primary" shape="round" onClick={() => handleClickUnlike(val.CategoryId)}>
                                                        Gỡ yêu thích
                                            </Button>
                                                </span>
                                                :
                                                <></>
                                            }
                                            <span style={{ color: 'red', fontWeight: 'bold', bottom: 5, position: 'absolute', right: 5 }} > <i className="fa fa-user" /> : {val.DislayName} </span>
                                        </div>
                                        <div className="cours-more-info">
                                            <div className="review">
                                                <div>Like: {val.QuanLike} <i className="fa fa-heart" /> </div>
                                                <div>Rate: {val.Rate}/5 <i className="fa fa-star" style={{ color: '#FFFF33' }} />  </div>
                                            </div>
                                            {
                                                val.IsRes ?
                                                    <div className="price">
                                                        <div className="text-center">Đã đăng ký</div>
                                                        <div className="text-center">
                                                            <Checkbox id={val.CategoryId} onChange={onChange} defaultChecked={val.IsDone} className="text-center" style={{ fontSize: 12 }} >Hoàn thành</Checkbox>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="price">
                                                        {
                                                            val.value != null
                                                                ? <>
                                                                    <del> {parseInt(val.Price).toLocaleString()} đ </del>
                                                                    <h5>{(val.Price * (100 - val.value) / 100).toLocaleString()} đ </h5>
                                                                </>
                                                                : <>
                                                                    <br></br><h5>{parseInt(val.Price).toLocaleString()} đ </h5>  </>
                                                        }
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        {
                            categories.length == 0
                                ?
                                <></>
                                :
                                <div className="col-lg-12 m-b20"  >
                                    <div className="pagination-bx rounded-sm gray clearfix" >
                                        <Pagination current= { defaultCurrent }

                                            style={{ textAlign: 'center' }}
                                            defaultPageSize={numEachPage}
                                            onChange={handleChange} total={categories.length} />
                                    </div>
                                </div>
                        }
                    </div>
            }
        </>
    )
}


export default CoursesList
