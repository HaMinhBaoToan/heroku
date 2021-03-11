import { useContext } from "react";
import { Link } from "react-router-dom";

import {AppContext} from "../../../utils/AppContext";



const Slide = () => {
  const {
    checkLocalStorage
  } = useContext(AppContext);
  return (
    <div style={{ height: window.innerHeight-70, backgroundSize:'cover', backgroundImage:'URL('+ process.env.PUBLIC_URL + '/assets/images/slider/slide1.jpg)'}}>
      <div style={{height: window.innerHeight-70, backgroundSize:'cover', backgroundColor:'black', opacity:'0.8', display: 'grid' }} >
      <div className="container-silder ">
        <div className="row">
          <div className="col-md-12 text-center text-white heading-bx" >
            <h2 className="title-head m-b0">Chào Mừng bạn đến Online Academy</h2>
            <p className="m-t20">Online Academy là một tổ chức phi lợi nhuận mô phỏng lại việc học để trao quyền cho sinh viên và các nhà giáo dục phát triển trong một xã hội có mạng lưới toàn cầu.</p>
            <p className="m-t10">Giáo dục đang thay đổi, nhưng con người vẫn quan trọng nhất</p>
            {checkLocalStorage 
              ?
                <></> 
              :

                <Link to="/register" className="btn-nocolor radius-xl" style={{ width:'200px', background:'#2e2c2a'}}>
                  Đăng Ký Ngay
                </Link>

            }
          </div>
        </div>  
        </div>
      </div>
    </div>
  );
};

export default Slide;