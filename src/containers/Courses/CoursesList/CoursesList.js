import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Pagination } from 'antd';

const CoursesList = (props) => { 

    const numEachPage = 9;
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(numEachPage);

    const handleChange = (value) => {
        console.log(value);
        setMinValue((value - 1) * numEachPage);
        setMaxValue(value * numEachPage);
    };
    return (
        <div className="col-lg-9 col-md-8 col-sm-12">
            <div className="row">
            { 
                props.categories.slice(minValue, maxValue).map(val => 
                    <div className="col-md-6 col-lg-4 col-sm-6 m-b20">
                        <div className="cours-bx">
                        <Link to to = {`/courses/${val.CategoryGroupId}-${val.CategoryGroupName}/${val.CategoryId}-${val.CategoryName}`} >
                            <div className="action-box"  style={{ height:'150px', backgroundSize:'cover', backgroundImage: `url(${val.Image})` }} />
                        </Link>
                            <div className="info-bx text-center" style={{height:'100px'}}>
                                <h5><Link to = {`/courses/${val.CategoryGroupId}-${val.CategoryGroupName}/${val.CategoryId}-${val.CategoryName}`} >{ val.CategoryName }</Link></h5>
                                <span> { val.CategoryGroupName } </span>
                            </div>
                            <div className="cours-more-info" style={{background:'white'}}>
                                <div className="review">
                                    <div>Like: { val.QuanLike } <i className="fa fa-heart"/> </div> 
                                    <div>Rate: { val.Rate }/5 <i className="fa fa-star"  style={{color:'#FFFF33'}} />  </div> 
                                </div>
                                <div className="price">
                                { val.value != null
                                    ? <>
                                        <del> { parseInt(val.Price).toLocaleString() } đ </del>
                                        <h5>{ (val.Price * (100-val.value) /100).toLocaleString()  } đ </h5> 
                                    </>
                                    : <> 
                                        <br></br><h5>{ parseInt(val.Price).toLocaleString() } đ </h5>  </> 
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                ) 
            }
            </div>
            <Pagination  defaultCurrent={ 1 } 
                        style={{ textAlign:'center'}}
                        defaultPageSize={numEachPage}
                        onChange={handleChange}  total={ props.categories.length } />
        </div>
    )
}


export default CoursesList
