import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { AppContext } from "../../utils/AppContext";
import "./Profile.scss";
import AuthService from "../../services/auth.service";
// UserService from "../../services/user.service";

import ChangeProfileUser from "./Handle/ChangeProfileUser";
import ChangePassword from "./Handle/ChangePassword";
import FavorCourse from "./Handle/FavorCourse";
import RegisteredCourse from "./Handle/RegisteredCourse";
import InfoTeacher from "./Handle/InfoTeacher";

const Profile = () => {
  const { userid, nameUser, imageUser, userJobId ,setimageUser} = useContext(AppContext);
  const [userEmail, setUserEmail] = useState("");
  const [render, setRender] = useState("");

  let { profileTitlle } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (userJobId === 3) {
      if(profileTitlle != "ChangeProfileUser" 
          && profileTitlle != "InfoTeacher" 
          && profileTitlle != "ChangePassword" ) {
            history.push(`/profile/InfoTeacher`);
          }
          setRender(profileTitlle != null ? profileTitlle : "InfoTeacher");
    } else if(userJobId === 2){
      if(profileTitlle != "FavorCourse" 
          && profileTitlle != "RegisteredCourse" 
          && profileTitlle != "ChangeProfileUser" 
          && profileTitlle != "ChangePassword" ) {
            history.push(`/profile/ChangeProfileUser`);
          }
      setRender(profileTitlle != null ? profileTitlle : "ChangeProfileUser");
    } else {
      if(profileTitlle != "ChangeProfileUser" 
          && profileTitlle != "ChangePassword" ) {
            history.push(`/profile/ChangeProfileUser`);
          }
          setRender(profileTitlle != null ? profileTitlle : "ChangeProfileUser");
    }
    AuthService()
      .getProfile({
        userId: userid,
      })
      .then((data) => {
        setUserEmail(data.data.user[0].Email);
      });
  }, [profileTitlle]);

  return (
    <div className="page-content">
      <div className="content-block">
        <div className="section-area section-sp1">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-md-4 col-sm-12">
                <div className="profile-bx text-center">
                  <div className="user-profile-thumb">
                    <img src= { imageUser ? imageUser : "https://res.cloudinary.com/dzyfkhpce/image/upload/v1616132109/OnlineAcademy/Avatar/avata_ywn2ea.png" }/>
                    
                  </div>
                  <div className="profile-info">
                    <h4>{nameUser}</h4>
                    <span>{userEmail}</span>
                  </div>
                  <div className="profile-social"></div>
                  <div className="profile-tabnav">
                    <ul className="nav nav-tabs">
                      {userJobId === 2 && (
                        <>
                          <li className="nav-item">
                            <Link to ="/profile/FavorCourse"
                              className={
                                render === "FavorCourse"
                                  ? `nav-link active `
                                  : `nav-link`
                              }
                              data-toggle="tab"
                              onClick={() => setRender("FavorCourse")}
                            >
                              <i className="ti-book"></i>
                              Khóa học yêu thích
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link to ="/profile/RegisteredCourse"
                              className={
                                render === "RegisteredCourse"
                                  ? `nav-link active `
                                  : `nav-link`
                              }
                              data-toggle="tab"
                              onClick={() => setRender("RegisteredCourse")}
                            >
                              <i className="ti-bookmark-alt"></i>
                              Khóa học đã đăng kí
                            </Link>
                          </li>
                        </>
                      )}
                      {userJobId === 3 && (
                        <>
                          <li className="nav-item">
                            <Link to="/profile/InfoTeacher"
                              className={
                                render === "InfoTeacher"
                                  ? `nav-link active `
                                  : `nav-link`
                              }
                              data-toggle="tab"
                              onClick={() => setRender("InfoTeacher")}
                            >
                              <i className="ti-book"></i>
                              Thông Tin Giảng Viên
                            </Link>
                          </li>
                        </>
                      )}
                      <li className="nav-item">
                        <Link to ="/profile/ChangeProfileUser"
                          className={
                            render === "ChangeProfileUser"
                              ? `nav-link active `
                              : `nav-link`
                          }
                          data-toggle="tab"
                          onClick={() => setRender("ChangeProfileUser")}
                        >
                          <i className="ti-pencil-alt"></i>
                          Thay đổi thông tin
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to ="/profile/ChangePassword"
                          className={
                            render === "ChangePassword"
                              ? `nav-link active `
                              : `nav-link`
                          }
                          data-toggle="tab"
                          onClick={() => setRender("ChangePassword")}
                        >
                          <i className="ti-lock"></i>
                          Thay đổi mật khẩu
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-4 col-sm-12">
                <div className="profile-content-bx">
                  <div className="tab-content">
                    {userJobId === 2 && render === "FavorCourse" && (
                      <FavorCourse />
                    )}
                    {userJobId === 2 && render === "RegisteredCourse" && (
                      <RegisteredCourse />
                    )}
                    {userJobId === 3 && render === "InfoTeacher" && (
                      <InfoTeacher />
                    )}
                    {render === "ChangeProfileUser" && (
                      <ChangeProfileUser setUserEmail={setUserEmail} />
                    )}
                    {render === "ChangePassword" && (
                      <ChangePassword userEmail={userEmail} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
