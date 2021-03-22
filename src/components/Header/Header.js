import { useContext, useState } from "react";
import { //Input,
        Avatar, Dropdown, Menu, notification } from "antd";
import { Link, useHistory } from "react-router-dom";

import AuthService from "../../services/auth.service";
import { AppContext } from "../../utils/AppContext";
import { parseAccessToken } from "../../utils/utils";

import Swal from  'sweetalert2'

//const { Search } = Input;

const HeaderCustomize = () => {
  const {
    nameUser,
    imageUser,
    //setnameUser,
    //saveToken,
    checkLocalStorage,
    //setCheckLocalStorage,
    //setCheckOTPConfim,
    logOut,
    userid,
    userJobId,
    //setUserJobId,
    setProfile,
  } = useContext(AppContext);
  const profileUser = () => {
    let userdata = {
      userId: userid,
    };

    AuthService()
      .getProfile(userdata)
      .then((data) => {
        setProfile(data.data.user[0]);
      });
  };
  // const onSearch = (value) => console.log(value);
  // const firstCharacter = (x) => {
  //   if (x) return x[0].toUpperCase();
  //   return x;
  // };

  const [textSearch, setTextSearch] = useState('');

  const menu = (
    <Menu style={{ width: 200 }} className="mt-3 px-2">
      {userJobId === 1 && (
        <Menu.Item>
          <Link to="/admin/user">
            <h6>
              <i className="fa fa-home mr-1" />
              Go page Admin
            </h6>
          </Link>
        </Menu.Item>
      )}
      {userJobId === 2 && (
        <h6 className="text-center text-black-50 mt-2">Sinh Viên</h6>
      )}
      {userJobId === 3 && (
        <h6 className="text-center text-black-50 mt-2">Giảng Viên</h6>
      )}
      <Menu.Item>
        <Link to="/profile">
          <h6>
            <i className="fa fa-user mr-1" />
            {nameUser}
          </h6>
        </Link>
      </Menu.Item>
      {userJobId === 3 && (
        <Menu.Item>
          <Link to="/manager/course">
            <h6>
              <i className="fa fa-bars mr-1" />
              Quản Lý 
            </h6>
          </Link>
        </Menu.Item>
      )}
      <Menu.Item>
        <Link to="/" onClick={logOut}>
          <h6>
            <i className="dropdown-icon mdi mdi-logout-variant fs-30 mr-1 leading-tight" />
            Đăng Xuất
          </h6>
        </Link>
      </Menu.Item>
    </Menu>
  );

  const login_register = () => {
    return (
      <>
        <li>
          <div className="d-flex align-items-stretch ">
            <div className="pt-btn-join ">
              <Link to="/login" className="btn-nocolor radius-xl">
                Đăng Nhập
              </Link>
            </div>
            <div className="pt-btn-join">
              <Link to="/register" className="btn-color radius-xl">
                Đăng Ký
              </Link>
            </div>
          </div>
        </li>
      </>
    );
  };

  const changeSearch = event => {
    setTextSearch(event.target.value);
  }

  const history = useHistory();
  const handleOnClick = () => {
    if(textSearch == '') { 
      Swal.fire(
        'Tìm Kiếm',
        'Vui lòng nhập thông tin cần tìm kiếm'
      )
    } else {
      history.push(`/courses/search?keyword=${textSearch}`);
      setTextSearch('');
    }
  };

  const islogin = () => {
    const tokenString = parseAccessToken(
      localStorage.getItem("AcademyOnline_Token")
    );
    if (tokenString) {
      setTimeout(() => {
        notification["warning"]({
          message: "Phiên đăng nhập đã hết hạn vui lòng đăng nhập lại",
        });
        logOut();
      }, tokenString.exp * 1000 - Date.now());
    }

    return (
      <>
      { userJobId == 2 ?
      <>
        <li>
          <Link to="/profile/FavorCourse" className="text-white">
            <span className="h6">
              <i style={{ marginLeft: "20px" }} className="fa fa-heart-o" /> Yêu
              thích
            </span>
          </Link>
        </li>
      </>      
      : <></>  
      }
        <li>
          <Link to="/profile/RegisteredCourse" className="text-white">
            <span className="h6">
              <i
                style={{ marginLeft: "20px" }}
                className="typcn typcn-chevron-right-outline"
              />{" "}
              Khóa học của tôi
            </span>
          </Link>
        </li>
        <li>
          <Dropdown overlay={menu}>
            <Link
              className="ant-dropdown-link text-white"
              to="/profile"
              onClick={profileUser}
            >
              <Avatar size="large" src= { imageUser ? imageUser : "https://res.cloudinary.com/dzyfkhpce/image/upload/v1616132109/OnlineAcademy/Avatar/avata_ywn2ea.png" } />
            </Link>
          </Dropdown>
        </li>
      </>
    );
  };

  return (
    <header className="header rs-nav header-transparent">
      <div className="top-bar">
        <div className="container">
          <div className="row d-flex justify-content-between">
            <div className="topbar-left">
              <div className="menu-logo">
                <Link to="/">
                  <img
                    src={process.env.PUBLIC_URL + "/logo.png"}
                    // {imageUser}
                    className="logo"
                    alt=""
                  />
                </Link>
              </div>
              <div className="ttr-search-input-wrapper">
                <input
                  type="text"
                  name="search"
                  placeholder="Tìm kiếm khóa học, lĩnh vực, ..."
                  className="ttr-search-input"
                  value={textSearch}
                  onChange={changeSearch}
                />
                <button
                  type="submit"
                  name="search"
                  className="ttr-search-submit"
                  onClick={ () => handleOnClick() }>
                    <i className="fa fa-search" />
                </button>

              </div>
            </div>
            <div className="topbar-right">
              <ul>
                <li>
                  <Link to="/courses" className="text-white ">
                    <span className="h6">
                      <i
                        style={{ marginLeft: "20px" }}
                        className="typcn typcn-point-of-interest-outline"
                      />{" "}
                      Khóa Học
                    </span>
                  </Link>
                </li>
                {checkLocalStorage  ? islogin() : login_register()}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderCustomize;
