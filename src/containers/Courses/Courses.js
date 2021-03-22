import React, { useState, useEffect, useContext } from "react";
import CoursesServices from "../../services/courses.service";
import {
    useParams, Link
} from "react-router-dom";
import CoursesList from './CoursesList/CoursesList'
import { Breadcrumb, Menu, Dropdown } from 'antd';
import { AppContext } from "../../utils/AppContext";

const Courses = (props) => {

    let { CategoryGroup } = useParams();

    const test = 'freetuts.net la blog chia se kien thuc lap trinh mien phi';

    var data = test.split(' ');
    var searchText = "";
    data.map(e => searchText += ".*" + e  );

    console.log(searchText);

    let { userid } = useContext(AppContext);

    const keyId = String(CategoryGroup === undefined ? '0' : CategoryGroup.indexOf('search') > - 1 ? '0' : CategoryGroup.split("-")[0]);
    const defaultName = CategoryGroup === undefined ? '' : CategoryGroup.indexOf('search') > - 1 ? '' : ` > ${CategoryGroup.split("-")[1]}`;

    const [categoryGroup, setCategoryGroup] = useState([]);
    const [CategoryGroupName, setCategoryGroupName] = useState(defaultName);
    const [categories, setCategories] = useState([]);
    const [categoriesTemp, setCategoriesTemp] = useState([]);
    const [coursesList, setCoursesList] = useState(<CoursesList userid={userid} categories={categories} />)
    const [valueInputSearch, setValueInputSearch] = useState('');
    const [textSort, SetTextSort] = useState('');

    useEffect(() => {
        //Lọc List ALL CategoryGroup

        CoursesServices().CategoryGroup()
            .then((response) => {
                setCategoryGroup(response.data);
            });
        SetTextSort('');
        //Lọc List Category
        if (keyId > 0) {
            CoursesServices().getCategoryByGroupId(keyId, userid != undefined ? userid : 0)
                .then((response) => {
                    setCategories(response.data);
                    setCategoryGroupName(defaultName);
                    setCoursesList(<CoursesList userid={userid} categories={response.data} />);
                });
        }
        else {
            setCategoryGroupName('');
            const searchkey = new URLSearchParams(props.location.search).get('keyword');
            const keyword = searchkey === null ? '' : searchkey;
            if(keyword === '') {
                CoursesServices().getCategoryAllGroup(userid != undefined ? userid : 0)
                .then((response) => {
                    setCategoriesTemp(response.data);
                    setCategories(response.data);
                    setCoursesList(<CoursesList userid={userid} categories={ response.data } />);
                })
            }
            else {
                setValueInputSearch(keyword);
                CoursesServices().getCategorybySearch(userid != undefined ? userid : 0, keyword)
                .then((response) => {
                    setCategoriesTemp(response.data);
                    setCategories(response.data);
                    setCoursesList(<CoursesList userid={userid} categories={ response.data } />);
                })
            }
        }
    }, [props.location.search, userid]);

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
        const id = val === 0 ? 0 : val.CategoryGroupId;
        SetTextSort('');
        setValueInputSearch('');
        if (id > 0) {
            CoursesServices().getCategoryByGroupId(id, userid != undefined ? userid : 0 )
                .then((response) => {
                    setCategories(response.data);
                    setCategoriesTemp(response.data);
                    setCategoryGroupName(`> ${val.CategoryGroupName}`);
                    setCoursesList(<CoursesList userid={userid} categories={response.data} />);
                });
        }

        else {
            CoursesServices().getCategoryAllGroup(userid != undefined ? userid : 0)
                .then((response) => {
                    setCategoriesTemp(response.data);
                    setCategories(response.data);
                    setCoursesList(<CoursesList userid={userid} categories={ response.data } />);
                });
        }
    }

    const changeSearch = event => {
        setValueInputSearch(event.target.value);
        if (event.target.value === '') {
            setCategoriesTemp([]);
        }
        if (categories.length > 0) {
            SetTextSort('');
            setCategoriesTemp(categories.slice().filter(data =>
                xoa_dau(data.CategoryName).indexOf(xoa_dau(event.target.value)) > -1));

            setCoursesList(<CoursesList userid={userid} categories={categories.filter(data =>
                xoa_dau(data.CategoryName).indexOf(xoa_dau(event.target.value)) > -1)} />);
        }

    }

    const menu = (
        <Menu >
            <Menu.Item onClick={() => handClickSortPriceCT()} > Giá cao đến thấp </Menu.Item>
            <Menu.Item onClick={() => handClickSortPriceTC()}>Giá thấp đến cao</Menu.Item>
            <Menu.Item onClick={() => handClickSortLike()}>Yêu thích nhất</Menu.Item>
            <Menu.Item onClick={() => handClickSortRate()}>Đánh giá cao nhất</Menu.Item>
        </Menu>
    )

    const handClickSortPriceCT = () => {
        const categoriesTempSort = categoriesTemp.length > 0 ? categoriesTemp.slice() : categories.slice();
        setCoursesList(<CoursesList userid={userid} categories={categoriesTempSort.sort(function (a, b) { return a.Price > b.Price ? -1 : a.Price < b.Price ? 1 : 0 })} />);
        SetTextSort(': Giá cao đến thấp')
    }
    const handClickSortPriceTC = () => {
        const categoriesTempSort = categoriesTemp.length > 0 ? categoriesTemp.slice() : categories.slice();
        setCoursesList(<CoursesList userid={userid} categories={categoriesTempSort.slice().sort(function (a, b) { return a.Price < b.Price ? -1 : a.Price > b.Price ? 1 : 0 })} />);
        SetTextSort(': Giá thấp đến cao')
    }
    const handClickSortLike = () => {
        const categoriesTempSort = categoriesTemp.length > 0 ? categoriesTemp.slice() : categories.slice();
        setCoursesList(<CoursesList userid={userid} categories={categoriesTempSort.slice().sort(function (a, b) { return a.QuanLike > b.QuanLike ? -1 : a.QuanLike < b.QuanLike ? 1 : 0 })} />);
        SetTextSort(': Yêu thích nhất')
    }
    const handClickSortRate = () => {
        const categoriesTempSort = categoriesTemp.length > 0 ? categoriesTemp.slice() : categories.slice();
        setCoursesList(<CoursesList userid={userid} categories={categoriesTempSort.slice().sort(function (a, b) { return a.Rate > b.Rate ? -1 : a.Rate < b.Rate ? 1 : 0 })} />);
        SetTextSort(': Đánh giá cao nhất')
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
                                Khóa Học   {CategoryGroupName}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-4 col-sm-12 m-30">
                            { valueInputSearch ===  '' ?
                                <></>
                                :
                                <div className="widget courses-search-bx placeani">
                                    <div className="form-group">
                                        <div className="input-group">
                                            Kết quả tìm kiếm:  { valueInputSearch }
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="widget widget_archive">
                                <h5 className="widget-title style-1">Lĩnh Vực</h5>
                                <Menu defaultSelectedKeys={[keyId]} theme="dark">
                                    <Menu.Item key="0" onClick={() => handleClickCategoryGroupName(0)}>
                                        <Link to={`/courses`} >
                                            Tất cả Lĩnh vực
                                    </Link>
                                    </Menu.Item>
                                    {
                                        categoryGroup.map((val, index) =>
                                            <Menu.Item key={val.CategoryGroupId} onClick={() => handleClickCategoryGroupName(val)} >
                                                <Link to={`/courses/${val.CategoryGroupId}-${val.CategoryGroupName}`}>
                                                    {val.CategoryGroupName}
                                                </Link>
                                            </Menu.Item>
                                        )
                                    }
                                </Menu>
                            </div>
                        </div>
                        <div className="col-lg-9 col-md-8 col-sm-12">
                            <Dropdown overlay={menu} trigger={['click']} >
                                <span style={{ fontWeight: 'bold', fontSize: 15, lineHeight: '50px', textAlign: 'right' }} > <i className="ti-bar-chart" /> Sắp xếp  {textSort} </span>
                            </Dropdown>
                            {coursesList}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Courses
