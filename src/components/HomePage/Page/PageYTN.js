import React, { useEffect, useState } from "react";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Products from "../../Products/Products"
import HomeServices from "../../../services/home.service"

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 5
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

const PageYTN = () => {

    const [categories, setCategories] = useState([]);
    const quanlimit = 5;

    useEffect(() => {
        HomeServices().showCategorySortWeekLikeDetail(quanlimit).then((res) => {
        setCategories(res.data);
    })
    }, []);

    return (
        <div className="section-area section-sp2 popular-courses-bx">
            <div className="container">
                 <div className="row">
                     <div className="col-md-12 heading-bx left">
                         <h2 className="title-head">Nổi bật nhất</h2>
                         <p>5 khóa học được yêu thích nhất trong tuần</p>
                     </div>
                 </div>
                 <Carousel responsive={responsive}>
                    {categories.map((item, index) => {
                        return (
                            <Products key = {index}  products = { item } />
                        )
                    })
                    }           
                </Carousel>
            </div>
     </div>
    )
}

export default PageYTN;

