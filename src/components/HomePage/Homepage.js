import React from "react";

import Slide from "./Slide/Slide"
import PageYTN from "./Page/PageYTN"
import PageXNN from "./Page/PageXNN"
import PageDK from "./Page/PageDK"
import PageMN from "./Page/PageMN"

const Homepage = () => {

  return (
    <div>
      <Slide/>
      <PageYTN />
      <PageXNN />
      <PageDK  />
      <PageMN  />
    </div>
  );
};

export default Homepage;

