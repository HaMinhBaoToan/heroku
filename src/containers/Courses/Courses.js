import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import {
    useParams, Link
  } from "react-router-dom";
import CoursesList from './CoursesList/CoursesList'
import { Breadcrumb, Menu } from 'antd';
import _ from "lodash";


const Courses = () => {

    let { CategoryGroup } = useParams();
    
    const key = String(CategoryGroup === undefined ? '0' : CategoryGroup.indexOf('search=') > - 1 ? '' : CategoryGroup.split("-")[0]);
    const defaultName = CategoryGroup === undefined ? '' : CategoryGroup.indexOf('search=') > - 1 ? '' : ` > ${CategoryGroup.split("-")[1]} `
    
    const [categoryGroup, setCategoryGroup] = useState([]);
    const [categories, setCategories] = useState([]);
    const [CategoryGroupName, setCategoryGroupName] = useState(defaultName);
    const [item, setCoursesList] = useState(<CoursesList categories = {categories} />)
 

    useEffect(() => {
        axios.get(` /api/courses/categorygroup`)
        .then((response) => {
            setCategoryGroup(response.data);
        });

        axios.get(` /api/home/showCategory`)
        .then((response) => {
            if(CategoryGroup === undefined) {
                console.log(0);
                setCoursesList(<CoursesList categories = { response.data } />);
            }
            else {
                console.log(CategoryGroup);
                if(String(CategoryGroup).indexOf('search=') > - 1) {
                    setCoursesList(<CoursesList categories = { response.data.filter(data => 
                                                                xoa_dau(data.CategoryName).indexOf(xoa_dau(CategoryGroup.replace('search=','')))  > -1 ) } />);
                }
                else {
                    setCoursesList(<CoursesList categories = { response.data.filter(data => data.CategoryGroupId == key ) } />);
                }
            }
            setCategories(response.data);
        });
    },[]);

    function xoa_dau(str) {
        str = str.toLowerCase(str);
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        return str;
    }
    

    const handleClickCategoryGroupName = (val) => {
        if(val === 0) {
            setCoursesList(<CoursesList categories = { categories } />)
            setCategoryGroupName('');
        }
        else {
            const list = categories.filter(data => data.CategoryGroupId == val.CategoryGroupId);
            setCoursesList(<CoursesList categories = { list } />)
            setCategoryGroupName(`> ${val.CategoryGroupName}`);
        }
    }

    return (
        <div className="content-block">
            <div className="section-area section-sp1">
                <div className="container">
                    <div className="m-b20">
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link to="/">Trang Chủ</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                Khóa Học   { CategoryGroupName }
                            </Breadcrumb.Item>
                        </Breadcrumb>   
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-4 col-sm-12 m-30">
                            <div className="widget courses-search-bx placeani">
                                <div className="form-group">
                                <div className="input-group">
                                    <label>Tìm kiếm khóa học</label>
                                    <input name="dzName" type="text" required className="form-control" />
                                </div>
                                </div>
                            </div>
                            <div className="widget widget_archive">
                                <h5 className="widget-title style-1">Lĩnh Vực</h5>
                                <Menu  defaultSelectedKeys={[ key ]}  theme="dark">
                                    <Menu.Item key="0" onClick={ () => handleClickCategoryGroupName(0) }>
                                    <Link to= {`/courses`} >
                                        Tất cả Lĩnh vực
                                    </Link>
                                    </Menu.Item>    
                                    {
                                        categoryGroup.map( (val, index) => 
                                            <Menu.Item key= { val.CategoryGroupId } onClick={ () => handleClickCategoryGroupName(val) } >
                                            <Link to= {`/courses/${val.CategoryGroupId}-${val.CategoryGroupName}` }>
                                                { val.CategoryGroupName }
                                                </Link>
                                            </Menu.Item>    
                                        )
                                    }
                                </Menu>
                            </div>
                        </div>
                        { item }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Courses
