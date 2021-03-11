import React, { useContext } from "react";
import { Button, Layout, Menu } from "antd";
import "./AdminBasic.scss";
import {
  OrderedListOutlined,
  HomeOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { AppContext } from "../../../utils/AppContext";

const AdminBasic = ({ children }) => {
  const { logOut, nameUser } = useContext(AppContext);
  const history = useHistory();
  const location = useLocation();
  return (
    <Layout className="layout-admin">
      <Layout.Sider width={250} height={"100%"}>
        <Link to="/" className="logo-admin">
          <img
            src={process.env.PUBLIC_URL + "/logo.png"}
            width="200"
            alt="logo"
          />
        </Link>
        <Menu theme="dark" selectedKeys={[location.pathname]}>
          <Menu.Item
            key="/admin/user"
            icon={<HomeOutlined />}
            onClick={() => history.push("/admin/user")}
          >
            Học viên và giảng viên
          </Menu.Item>
          <Menu.Item
            key="/admin/categories"
            icon={<OrderedListOutlined />}
            onClick={() => history.push("/admin/categories")}
          >
            Lĩnh vực
          </Menu.Item>
          <Menu.Item
            key="/admin/source"
            icon={<ReadOutlined />}
            onClick={() => history.push("/admin/source")}
          >
            Khoá học
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout>
        <Layout.Header className="header-admin">
          <Button type="primary">{nameUser}</Button>
          <Link to="/" onClick={logOut}>
            <Button type="text" className="mr-4">
              Đăng Xuất
            </Button>
          </Link>
        </Layout.Header>
        <Layout.Content className="layoutContent-admin">
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
export default AdminBasic;
