import React from "react";

import HeaderCustomize from "../../components/Header/Header";
import FooterCustomize from "../../components/Footer/Footer";
import { Layout } from "antd";

export const Default = (props) => {
  return (
    <>
      <HeaderCustomize />
        <Layout style={{paddingTop:'70px'}}>
            {props.children}
      </Layout>
      <FooterCustomize />
    </>
  );
};

export default Default;
