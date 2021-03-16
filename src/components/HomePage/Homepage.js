import React, { useEffect, useState } from "react";
import axios from "axios";

import Slide from "./Slide/Slide"
import PageYTN from "./Page/PageYTN"
import PageXNN from "./Page/PageXNN"
import PageDK from "./Page/PageDK"
import PageMN from "./Page/PageMN"

const Homepage = () => {

  const [categories, setCategories] = useState([]);

    useEffect(() => {
    let url = "http://localhost:4000/api/home/showCategory";
    axios.get(url).then((res) => {
        setCategories(res.data);
    })
    }, []);
  return (
    <div>
      <Slide/>
      <PageYTN categories = {categories} />
      <PageXNN categories = {categories} />
      <PageDK categories = {categories} />
      <PageMN categories = {categories} />
    </div>
  );
};

export default Homepage;
