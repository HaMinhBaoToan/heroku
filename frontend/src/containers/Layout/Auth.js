import React from "react";
import { Link } from "react-router-dom";

export const Auth = (props) => {
  return (
    <>
     <div className="page-wraper">
      <div className="account-form">
        <div className="account-head">
          <Link to="/">
            <img
              src={process.env.PUBLIC_URL + "/logo.png"}
              alt=""
              width={320}
            />
          </Link>
        </div>
        {props.children}
      </div>
    </div>
     
    </>
  );
};

export default Auth;
