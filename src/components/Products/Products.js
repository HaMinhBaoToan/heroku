import * as React from "react";
import { Rate } from 'antd';
import { Link } from "react-router-dom";
import moment from 'moment';


const Products = (props) => {
  return (
    <div className="item" style={{margin:'0 5px'}}>
      <div className="cours-bx">
        <Link to = {`/courses/${props.products.CategoryGroupId}-${props.products.CategoryGroupName}/${props.products.CategoryId}-${props.products.CategoryName}` } >
          <div className="action-box"  style={{ height:'200px', backgroundSize:'cover', backgroundImage: `url(${props.products.Image})` }} />
        </Link>
        <div className="info-bx text-center" style={{height:'100px'}}>
            <h5><Link to = {`/courses/${props.products.CategoryGroupId}-${props.products.CategoryGroupName}/${props.products.CategoryId}-${props.products.CategoryName}`} >{ props.products.CategoryName }</Link></h5>
            <span> { props.products.CategoryGroupName } </span>
        </div>
        <div className="info-bx">
          <ul className="media-post">
            <li><i className="fa fa-calendar" />: {moment(props.products.Create_At).format('DD/MM/yyyy') }</li>
            <li><i className="fa fa-user" />: {props.products.DislayName}</li>
          </ul>
        </div>
        
        <div className="cours-more-info" style={{background:'white'}}>
            <div style={{width:'50%', padding:'0px 5px'}}>
              <span > <i className="fa fa-user" /> : { props.products.QuanRes } . </span> 
              <span > <i className="fa fa-heart" /> : { props.products.QuanLike } . </span> 
              <span > <i className="fa fa-eye" /> : { props.products.TotalView }  </span> 
              <Rate allowHalf disabled defaultValue={ props.products.Rate} /> { props.products.Rate }/5
            </div>
            <div className="price">
            { props.products.value != null
            ? <>
                <del> { parseInt(props.products.Price).toLocaleString() } đ </del>
                <h5>{ (props.products.Price * (100-props.products.value) /100).toLocaleString()  } đ </h5> 
              </>
            : <> 
                <br></br><h5>{ parseInt(props.products.Price).toLocaleString() } đ </h5>  </> }
            </div>
        </div>
      </div>
  </div>
    );
};

export default Products;