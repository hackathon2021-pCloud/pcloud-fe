import { Fragment } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import Layout from "../Layout";
import Card from "../Card";
import Input from "../Input";
import * as style from "./index.module.css";
import CheckpointList from "./CheckpointList";
import useCluster from "../../client-utils/useCluster";
import Loader from "../Loader";
import { WarningOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, message, Modal } from "antd";
import { ClusterDeleteRequestBody, ClusterDeleteResponse } from "../../types";

const BASIC_INFO = [
  { label: "Create Time", key: "createTime" },
  { label: "Last Cehckpoint", key: "laskCheckpointTime" },
  { label: "ID", key: "id" },
  { label: "Setup Status", key: "setupStatus" },
  { label: "Storage Provider", key: "storageProvider" },
];

/**
export interface ClusterInfo extends BasicJsonModel {
  name: string;
  setupStatus: ClusterSetupStatus;
  laskCheckpointTime?: number;
  storageProvider: StorageProvider;
  authKey: string;
  backupSize?: number;
  owner: string;
}
 */

export default function Cluster() {
  const { user } = useUser();
  const router = useRouter();
  const { id } = router.query;
  const clusterSwr = useCluster({ userId: user.sub, clusterId: id as string });

  if (!id) {
    return (
      <Layout title="Cluster">
        <Fragment>
          No cluster id specified,{" "}
          <Link href={"/"}>
            <a>back to Dashbaord</a>
          </Link>
        </Fragment>
      </Layout>
    );
  }

  if (clusterSwr.data?.msg === "forbidden") {
    return (
      <Layout title={`Cluster${cluster ? `: ${cluster.name}` : ""}`}>
        <div className={style.forbiddenWrapper}>
          <WarningOutlined
            width={80}
            height={80}
            className={style.forbiddenIcon}
            style={{ width: 70, height: 70, color: "#90A0B7" }}
          />
          <div className="textMedium15" style={{ color: "#90a0b7" }}>
            Forbidden
          </div>
        </div>
      </Layout>
    );
  }

  if (!clusterSwr.data?.cluster) {
    return (
      <Layout title={`Cluster${cluster ? `: ${cluster.name}` : ""}`}>
        <div className={style.loadingOverlay}>
          <Loader />
        </div>
      </Layout>
    );
  }

  const cluster = clusterSwr.data.cluster;

  return (
    <Layout title={`Cluster${cluster ? `: ${cluster.name}` : ""}`}>
      <Fragment>
        <div className={style.header}>
          <h1 className="textMedium15">Cluster: {cluster.name}</h1>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  onClick={() => {
                    Modal.confirm({
                      title: "Remove Cluster",
                      content: "Are you sure to remove this cluster?",
                      onOk: async () => {
                        console.log(cluster);
                        const result: ClusterDeleteResponse = await fetch(
                          "/api/cluster",
                          {
                            body: JSON.stringify({
                              clusterId: cluster.id,
                              owner: user.sub,
                            } as ClusterDeleteRequestBody),
                            method: "DELETE",
                          }
                        ).then((res) => res.json());
                        if (result.deletedItemCount === 1) {
                          message.success("Cluster Removed");
                          await new Promise((res) =>
                            setTimeout(() => res(1), 1000)
                          );
                          router.push("/");
                        } else {
                          message.error(`unexpected response: ${JSON.stringify(result)}; Please refresh the page and try again.`)
                        }
                      },
                    });
                  }}
                  key="0"
                >
                  Remove Cluster
                </Menu.Item>
              </Menu>
            }
          >
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              Action <DownOutlined />
            </a>
          </Dropdown>
        </div>
        <Card className={style.infoCard}>
          <Fragment>
            <h2 className="textMedium14Black">Basic Info</h2>
            <ul className={style.infoList}>
              {BASIC_INFO.map(({ label, key }) => (
                <li key={label} className={style.infoItem}>
                  <Input
                    label={label}
                    value={cluster[key]}
                    type="showing"
                    onChange={() => {}}
                  />
                </li>
              ))}
            </ul>
          </Fragment>
        </Card>
        <CheckpointList cluster={cluster} />
      </Fragment>
    </Layout>
  );
}
