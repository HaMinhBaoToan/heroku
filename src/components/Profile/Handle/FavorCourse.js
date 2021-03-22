import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../../utils/AppContext";
import UserService from "../../../services/user.service";
import CoursesList from "../../../containers/Courses/CoursesList/CoursesList"

const FavorCourse = () => {
  const { userid } = useContext(AppContext);
  const [favoriteCategory, setFavoriteCategory] = useState([]);
  useEffect(() => {
    UserService()
      .getAllFavoriteCategory(userid)
      .then((data) => {
        if (data.data === false) {
          setFavoriteCategory([]);
        } else {
          setFavoriteCategory(data.data);
          console.log(data.data);
        }
      });
  }, []);

  return (
    <>
      <div className="profile-head">
        <h3>Khóa Học Yêu Thích</h3>
      </div>
      <div className="courses-filter">
        <div className="clearfix">
          {favoriteCategory.length <= 0 ? (
            <p className="mt-3 text-center">Không có khóa học yêu thích nào</p>
          ) : (
            <div className="row" >
              <div className="col-lg-10 col-md-12 col-sm-8" style={{margin:'0px auto'}}>
                <CoursesList unlikeUserId = { userid } categories = {favoriteCategory} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FavorCourse;
