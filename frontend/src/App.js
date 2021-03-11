import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  //Route,
  //Redirect,
} from "react-router-dom";

import "antd/dist/antd.css";
import "./assets/global.scss";

import AppRoute from "./AppRoute";

//page
import HomePage from "./components/HomePage/Homepage";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
//import Error from "./components/Error/Error";
import OTP from "./components/OTPComfirm/OTP";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Profile from "./components/Profile/Profile";
import Courses from "./containers/User/Teacher/Category";
import Category from "./containers/Courses/Courses";
import CoursesDetail from "./containers/CoursesDetail/CoursesDetail";
import ManagerUser from "./containers/Admin/User/ManagerUser";
import ManagerSource from "./containers/Admin/Source/ManagerSource";
import ManagerCategoriesGroup from "./containers/Admin/CategoriesGroup/ManagerCategoriesGroup";
import Detail from "./containers/User/Teacher/Category_Detail/Detail";
//layout
import Default from "./containers/Layout/Default";
import Auth from "./containers/Layout/Auth";
import AdminBasic from "./containers/Layout/AdminBasic/AdminBasic";

//utils
import { AppContext } from "./utils/AppContext";
import { parseAccessToken } from "./utils/utils";
import AuthService from "./services/auth.service";

const App = () => {
  const [nameUser, setnameUser] = useState(undefined);
  const [imageUser, setimageUser] = useState(undefined);

  const [profile, setProfile] = useState(undefined);
  const [userid, setUserid] = useState(0);
  const [userJobId, setUserJobId] = useState(0);

  const [checkOTPConfim, setCheckOTPConfim] = useState(undefined);
  const [checkLocalStorage, setCheckLocalStorage] = useState(false);
  const saveToken = (userToken) => {
    // dùng để lưu token khi đăng nhập
    localStorage.setItem("AcademyOnline_Token", JSON.stringify(userToken));
  };
  const logOut = () => {
    setnameUser();
    setimageUser();
    saveToken();
    setCheckLocalStorage(false);
    setCheckOTPConfim();
    setUserJobId(0);
    AuthService().logout();
    setUserid(0);
  };

  useEffect(() => {
    // dùng để lấy token trên local
    const tokenString = localStorage.getItem("AcademyOnline_Token");
    if (tokenString) {
      const {
        OTP_Confim,
        DislayName,
        UsersId,
        Image,
        JobId,
      } = parseAccessToken(tokenString); // lấy trường accessToken đi mã hoá
      setnameUser(DislayName);
      setimageUser(Image);
      setUserid(UsersId);
      setUserJobId(JobId);

      if (OTP_Confim.data[0] === 1) {
        setCheckOTPConfim(true);
      } else {
        setCheckOTPConfim(false);
      }
      setCheckLocalStorage(true);
      //
    }
  }, []);
  if (checkLocalStorage) {
    return (
      <AppContext.Provider
        value={{
          nameUser,
          imageUser,
          checkLocalStorage,
          checkOTPConfim,
          profile,
          userid,
          userJobId,
          setUserJobId,
          setnameUser,
          setimageUser,
          setUserid,
          setProfile,
          saveToken,
          setCheckLocalStorage,
          setCheckOTPConfim,
          logOut,
        }}
      >
        <Router>
          <Switch>
            {checkOTPConfim === false ? <OTP /> : ""}

            <AppRoute
              path={["/", "/home"]}
              layout={Default}
              component={HomePage}
              exact
            />
            <AppRoute
              path="/profile"
              layout={Default}
              component={Profile}
              exact
            />

            <AppRoute
              path="/courses/:CategoryId"
              layout={Default}
              component={CoursesDetail}
              exact
            />

            <AppRoute
              path="/courses"
              layout={Default}
              component={Category}
              exact
            />

            {/* teacher */}

            {userJobId === 3 && (
              <>
                <AppRoute
                  path="/courses-edit/:CategoryID"
                  layout={Default}
                  component={Detail}
                  exact
                />
                <AppRoute
                  path="/manager/course"
                  layout={Default}
                  component={Courses}
                  exact
                />
              </>
            )}
            {userJobId === 1 && (
              <>
                <AppRoute
                  path="/admin/user"
                  layout={AdminBasic}
                  component={ManagerUser}
                  exact
                />
                <AppRoute
                  path="/admin/categories"
                  layout={AdminBasic}
                  component={ManagerCategoriesGroup}
                  exact
                />
                <AppRoute
                  path="/admin/source"
                  layout={AdminBasic}
                  component={ManagerSource}
                  exact
                />
              </>
            )}

            {/* <AppRoute path="/error" layout={Default} component={Error} exact />
            <Redirect to="/error" /> */}
          </Switch>
        </Router>
      </AppContext.Provider>
    );
  } else {
    return (
      <AppContext.Provider
        value={{
          nameUser,
          imageUser,
          checkLocalStorage,
          checkOTPConfim,
          profile,
          userid,
          userJobId,
          setUserJobId,
          setnameUser,
          setimageUser,
          setUserid,
          setProfile,
          saveToken,
          setCheckLocalStorage,
          setCheckOTPConfim,
          logOut,
        }}
      >
        <Router>
          <Switch>
            {checkOTPConfim === false ? <OTP /> : ""}

            <AppRoute
              path={["/", "/home"]}
              layout={Default}
              component={HomePage}
              exact
            />

            <AppRoute
              path="/courses/:CategoryId"
              layout={Default}
              component={CoursesDetail}
              exact
            />

            <AppRoute
              path="/courses"
              layout={Default}
              component={Category}
              exact
            />

            <AppRoute path="/login" layout={Auth} component={Login} exact />
            <AppRoute
              path="/register"
              layout={Auth}
              component={Register}
              exact
            />
            <AppRoute
              path="/resetPassword"
              layout={Auth}
              component={ResetPassword}
              exact
            />
            {/* <AppRoute layout={Default} component={Error} exact /> */}
            {/* <AppRoute path="/error" layout={Default} component={Error} exact />
            <Redirect to="/error" /> */}
          </Switch>
        </Router>
      </AppContext.Provider>
    );
  }
};

export default App;
