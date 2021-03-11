import React from "react";

const BuyCourses = (props) => {

    return(
    <div className="col-lg-3 col-md-4 col-sm-12 m-b30" >
      <div className="course-detail-bx" >
        <div className="course-price">
          { props.categories.value != null
            ? <>
                <del> { parseInt(props.categories.Price).toLocaleString() } đ </del>
                <h4>{ (props.categories.Price * (100-props.categories.value) /100).toLocaleString()  } đ </h4> 
              </>
            : <> 
                <br></br><h4>{ parseInt(props.categories.Price).toLocaleString() } đ </h4> 
              </> 
          }
        </div>	
        <div className="course-buy-now text-center">
          <a className="btn radius-xl text-uppercase" >Đăng Ký Khóa Học</a>
        </div>
        <div className="teacher-bx">
          <div className="teacher-info">
            <div className="teacher-thumb">
              <img src={`data:image/jpg;base64,${props.categories.Ava}`} />
            </div>
            <div className="teacher-name">
              <h5>{ props.categories.DislayName }</h5>
            </div>
          </div>
        </div>
        <div className="cours-more-info">
          <div style={{width:'50%' , textAlign:'center'}}>
            <h4> { props.categories.Rate }/5 <i className="fa fa-star" style={{color:'#FFFF33'}} /></h4>  
            <span>{ props.categories.TotalRate } Đánh giá </span>
          </div>
          <div style={{width:'50%' , textAlign:'center'}}>
            <h4> { props.categories.QuanRes } <i className="fa fa-user" /></h4>  
            <span>Đã đăng ký</span>
          </div>
        </div>
        {/* <div className="course-info-list scroll-page">
          <ul className="navbar">
            <li><a className="nav-link" href="#overview"><i className="ti-zip"></i>Overview</a></li>
            <li><a className="nav-link" href="#curriculum"><i className="ti-bookmark-alt"></i>Curriculum</a></li>
            <li><a className="nav-link" href="#instructor"><i className="ti-user"></i>Instructor</a></li>
            <li><a className="nav-link" href="#reviews"><i className="ti-comments"></i>Reviews</a></li>
          </ul>
        </div> */}
      </div>
    </div>
    )
}

export default BuyCourses
