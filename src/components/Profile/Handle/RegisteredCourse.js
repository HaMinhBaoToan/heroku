import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../../utils/AppContext";
import UserService from "../../../services/user.service";
import CoursesList from "../../../containers/Courses/CoursesList/CoursesList"

const RegisteredCourse = () => {
  const { userid } = useContext(AppContext);
  const [filter, setFilter] = useState(undefined);
  const [coursesUser, setCoursesUser] = useState([]);
  const [coursesUserTemp, setCoursesUserTemp] = useState([]);

  useEffect(() => {
    UserService()
      .getCategorysUser(userid)
      .then((data) => {
        if (data.data === false) {
          setCoursesUser([]);
        } else {
          setFilter(undefined);
          setCoursesUser(data.data);
          setCoursesUserTemp(data.data);
        }
      });
  }, []);

  function handClickAll() {
    setFilter(undefined);
    setCoursesUserTemp(coursesUser.slice());
  }

  function handClickDone() {
    setFilter(1);
    setCoursesUserTemp(coursesUser.slice().filter(data => (
                          data.IsDone == 1 )))
  }

  function handClickNoDone() {
    setFilter(0);
    setCoursesUserTemp(coursesUser.slice().filter(data => (
                          data.IsDone == 0 )))
  }
  return (
    <div>
      <div className="profile-head">
        <h3>Khóa Học Đã Đăng Ký</h3>
        <div className="feature-filters style1 ml-auto">
          <ul className="filters" data-toggle="buttons">
            <li data-filter className="btn active">
              <input type="radio" />
              <a onClick={() => handClickAll() }><span>Tất cả</span></a> 
            </li>
            <li data-filter="publish" className="btn">
              <input type="radio" />
              <a onClick={() => handClickDone() }><span>Hoàn thành</span></a> 
            </li>
            <li data-filter="pending" className="btn">
              <input type="radio" />
              <a onClick={() => handClickNoDone() }><span>Chưa hoàn thành</span></a> 
            </li>
          </ul>
        </div>
      </div>
      <div className="courses-filter">
        <div className="clearfix">
          {coursesUserTemp.length <= 0 ? (
            <p className="mt-3 text-center">Bạn chưa đăng kí khóa học nào</p>
          ) : (
            <div className="row">
              <div className="col-lg-10 col-md-12 col-sm-8" style={{margin:'0px auto'}}>
                <CoursesList filter= { filter } userid = {userid} categories = {coursesUserTemp} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisteredCourse;
