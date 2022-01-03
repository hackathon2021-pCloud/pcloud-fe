import React from "react";
import cx from 'classnames'
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import "antd/dist/antd.css";
import { Layout, Menu, Breadcrumb } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import * as style from './Layout.module.css'
import Avatar from "./Avatar";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default function BasicLayout({
  children,
}: {
  children: React.ReactChild;
}) {
  const { user, error, isLoading } = useUser();
  const [collapsed, setCollapsed] = React.useState(false);
  const router = useRouter()

  if (!user) {
    return null;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(nextValue) => {
          setCollapsed(nextValue);
        }}
        theme="light"
        className={cx(
          style.sider,
          collapsed ? style.collapsedSider : style.fullSider
        )}
        width={256}
        collapsedWidth={94}
      >
        <div className={style.logo}>pCloud</div>
        <div className={style.user}>
          <Avatar user={user} shadow={false} className={style.avatar} />
          <div>
            <p
              className={cx(
                "textMedium14Black",
                style.name,
                collapsed && style.hide
              )}
            >
              {user.name}
            </p>
            <p
              className={cx(
                "textMedium11Gray",
                style.email,
                collapsed && style.hide
              )}
            >
              {user.email}
            </p>
          </div>
        </div>
        <Menu theme="light" selectedKeys={[router.pathname]} onSelect={(info) => {
          router.push(info.key)
        }} >
          <Menu.Item
            key="/dashboard"
            icon={<PieChartOutlined />}
            className={cx("textMedium13", style.menuItem)}
          >
            Dashboard
          </Menu.Item>
          <Menu.Item
            key="/clusters"
            icon={<DesktopOutlined />}
            className={cx("textMedium13", style.menuItem)}
          >
            Clusters
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, height: 60 }} className={style.header} />
        <Content style={{ padding: "36px 50px" }}>
          {children}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}
