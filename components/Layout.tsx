import React from "react";
import cx from "classnames";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import "antd/dist/antd.css";
import { Layout, Menu, Modal } from "antd";
import {
  DashboardOutlined,
  DatabaseOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Head from "next/head";
import * as style from "./Layout.module.css";
import Avatar from "./Avatar";
import { SWRConfig } from "swr";

const { Header, Content, Sider } = Layout;

export default function BasicLayout({
  children,
  title = "pCloud Admin",
}: {
  children: React.ReactChild;
  title?: string;
}) {
  const { user, error, isLoading } = useUser();
  const [collapsed, setCollapsed] = React.useState(false);
  const router = useRouter();

  if (!user) {
    return null;
  }

  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
        revalidateOnFocus: false,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Head>
          <title>{title}</title>
        </Head>
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
          <Menu
            theme="light"
            selectedKeys={[router.pathname]}
            onSelect={(info) => {
              if (info.key === "/api/auth/logout") {
                Modal.confirm({
                  title: "Confirm to log out",
                  onOk: () => {
                    location.href = info.key;
                  },
                });
              } else {
                router.push(info.key);
              }
            }}
          >
            <Menu.Item
              key="/"
              icon={<DashboardOutlined />}
              className={cx("textMedium13", style.menuItem)}
            >
              Dashboard
            </Menu.Item>
            <Menu.Item
              key="/cluster"
              icon={<DatabaseOutlined />}
              className={cx("textMedium13", style.menuItem)}
            >
              Clusters
            </Menu.Item>
            <Menu.Item
              key="/api/auth/logout"
              icon={<LogoutOutlined />}
              className={cx("textMedium13", style.menuItem)}
            >
              Log Out
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header style={{ padding: 0, height: 60 }} className={style.header} />
          <Content style={{ padding: "36px 50px" }}>{children}</Content>
          {/* <Footer style={{ textAlign: "center" }}>
            pCloud 2022
          </Footer> */}
        </Layout>
      </Layout>
    </SWRConfig>
  );
}
