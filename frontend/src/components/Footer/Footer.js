import * as React from "react";
import { Link } from "react-router-dom";


const FooterCustomize = () => {
  return (
      <footer>
        <div className="footer-top" >
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-12 col-sm-12 footer-col-4">
                <div className="widget">
                    <h5 className="footer-title">Về chúng tôi</h5>
                    <p className="text-capitalize m-t20">Online Academy là một hệ thống đào tạo trực tuyến, cổng kết nối Chuyên gia với Học viên</p>
                    <p className="text-capitalize m-t20">Sứ mệnh của Online Academy là chia sẻ kiến thức thực tiễn tới 10 triệu người dân Việt Nam</p>             
                </div>
              </div>
              <div className="col-lg-6 col-md-12 col-sm-12 footer-col-4">
                <div className="widget">
                  <h5 className="footer-title">Liên hệ</h5>
                  <div className="m-t20">
                    <i className="fa fa-home m-r5"></i>{": "}
                    <Link to="https://goo.gl/maps/m7yhgxR3N8cn2koX9" target="_blank">
                      227 Nguyễn Văn Cừ, Phường 4, Quận 5, TP.Hồ Chí Minh
                    </Link>
                  </div>
                  <div className="m-t20 email">
                  <i className="fa fa-envelope m-r5"></i>{": "}
                    <Link to="mailto:suport@trumsosanh.vn?subject=Help Need">
                      suport@onlineacademy.vn
                    </Link>
                  </div>
                  <div className="m-t20">
                  <i className="fa fa-phone m-r5"></i>{": "}
                    <Link to="tel:0868681051" className="text-90">
                      (+84) 86 861 051
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-2 col-md-12 col-sm-12 footer-col-4">
                <div className="m-t20">
                  <img src={process.env.PUBLIC_URL + "/hitop.png"} alt=""/>
                </div>
              </div>
             </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 text-center">Copyright © 2021 VietNam</div>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default FooterCustomize;