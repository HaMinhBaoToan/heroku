import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactHtmlParser from 'react-html-parser';
import { Player } from 'video-react';
import Swal from  'sweetalert2'


const Detail = (props) => {
        
    const productView = [];
    const products = props.products;

    const quanRate = [props.categories.Rate1, props.categories.Rate2, props.categories.Rate3, props.categories.Rate4, props.categories.Rate5];

    function handleClickNumberNo(product) {
        if(!product.Public) {
            if(props.categories.IsRes == 0) {
                Swal.fire(
                    'Yêu cầu sở hữu khóa học',
                    'Vui lòng sở hữu khóa học để xem nội này'
                )
            }
        }
        else {
            console.log(product);
            if(productView.indexOf(product.CategoryId) < 0 ) {
                axios.put(`http://localhost:4000/api/courses/products/${ product.CategoryId }/${ product.Viewer + 1}`)
                .then((response) => {
                    productView.push(product.CategoryId);
               })  
            }
        } 
    }

    return (
        <div>
            {/* Image, Note, CategoryName */}

            <div className="courses-post">
                {/* <div style={{ height: window.innerHeight-70, backgroundSize:'cover', backgroundImage:'URL('+ process.env.PUBLIC_URL + '/assets/images/slider/slide1.jpg)'}}/> */}
                <div className="ttr-post-media media-effect" style={{}}>
                    <img src= { props.categories.Image } />
                </div>
                <div className="ttr-post-info">
                    <div className="ttr-post-title ">
                        <h2 className="post-title"> { props.categories.CategoryName } </h2>
                    </div>
                    <div className="ttr-post-text">
                        <p>{ props.categories.Note }</p>
                    </div>
                </div>
            </div>

            {/* Chi tiết khóa học */}

            <div className="courese-overview m-b20" > 
                <h4>Lợi ích từ khóa học</h4> 
                <ul className="list-checked primary">
                    { ReactHtmlParser( props.categories.Remark) }   
                </ul>          
            </div>

            {/* Nội dung bài học */}

            <div className="m-b20">
                <h4>Bài học</h4>
                {
                    products.map( i => 
                    <div className="panel">      
                        <div className="ttr-sidebar-navi">
                            <a onClick={ () => handleClickNumberNo(i)} data-toggle="collapse" href = {`#${i.ProductId}` } className="ttr-material-button" data-parent= {`#${i.ProductId}` }>
                                <span className="ttr-icon"> { i.Public ? <i className="fa fa-book" /> : props.categories.IsRes ? <i className="fa fa-book" /> : <i className="fa fa-lock"  /> } </span>
                                <span className="ttr-label">{ `Bài ${i.NumberNo < 10 ? '0'+i.NumberNo : i.NumberNo }: ${i.ProductName}` }</span>
                                <span className="ttr-arrow-icon"><i className="fa fa-angle-down" /></span>
                            </a>
                        </div>
                        <div id=  { i.Public ? i.ProductId : props.categories.IsRes ? i.ProductId : "lock" }  className="acod-body collapse">
                            <Player>
                                <source src= { i.Video }/>
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
                        <img src={`data:image/jpg;base64,${props.categories.Ava}`} />
                    </div>
                    <div className="instructor-info">  
                        <h3 className = "m-t30"> { props.categories.DislayName } </h3>
                        { ReactHtmlParser( props.categories.TeacherNote) }
                    </div>
                </div>
            </div>
            {/* Đánh giá */}

            <div className="">    
                <h4>Đánh giá</h4>
                <div className="review-bx">
                    <div className="all-review">
                        <h2 className="rating-type"> 
                            { props.categories.Rate }/5 <i className="fa fa-star" style={{color:'#FFFF33'}} />
                        </h2>   
                        <span>{ props.categories.TotalRate } Đánh giá </span>          
                    </div>
                    <div className="review-bar">
                    {
                        quanRate.map( (i , index) => 
                            <div className="bar-bx">
                                <div className="side">
                                    <div>{ index + 1} star</div>
                                </div>
                                <div className="middle">
                                    <div className="bar-container">
                                        <div className="bar-5" style={{width: props.categories.TotalRate == 0 ? 0 : ( i * 100/ props.categories.TotalRate) + '%'}} />
                                    </div>
                                </div>
                                <div className="side right">
                                    <div> { i }</div>
                                </div>
                            </div>
                        )
                    }
                    </div>
                </div>
                
            </div>
        </div>
    )
}
    

export default Detail
