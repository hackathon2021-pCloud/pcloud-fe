import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import cx from 'classnames'
import Layout from "../Layout";
import Card from "../Card";
import Input from "../Input";
import * as style from "./index.module.css";
import CheckpointList from "./CheckpointList";
import useCluster from "../../client-utils/useCluster";
import Loader from "../Loader";
import { WarningOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, message, Modal, Table } from "antd";
import { ClusterDeleteRequestBody, ClusterDeleteResponse } from "../../types";
import formatDate from "../../client-utils/formatDate";

const BASIC_INFO = [
  {
    label: "Create Time",
    key: "createTime",
    formatter: (time: number) => formatDate(time),
  },
  {
    label: "Last Checkpoint",
    key: "laskCheckpointTime",
    formatter: (time: number) => {
      if (time > Number(new Date('2021-01-01'))) {
        return formatDate(time);
      }
      return 'N/A'
    }
  },
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

const getBackupPriceInfo = (backupSize: number) => {
  if (isNaN(backupSize)) {
    backupSize = 10;
  }
  if (backupSize < 100) {
    return {
      text: "< 100GB (Free tier)",
      price: 0,
    };
  }
  if (backupSize < 1000) {
    return {
      text: `${backupSize}GB`,
      price: ((backupSize / 1000) * 30).toFixed(2),
    };
  }
  const tbNumber = (backupSize / 1000).toFixed(2);
  return {
    text: `${tbNumber}TB`,
    price: (parseFloat(tbNumber) * 30).toFixed(2),
  };
};

export default function Cluster() {
  const { user } = useUser();
  const router = useRouter();
  const { id } = router.query;
  const clusterSwr = useCluster({ userId: user.sub, clusterId: id as string });
  const [currentTable, setCurrentTable] = useState<"Checkpoints" | "Billing">("Checkpoints");

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
  const backupPriceInfo = getBackupPriceInfo(cluster.backupSize || 10);

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
                          message.error(
                            `unexpected response: ${JSON.stringify(
                              result
                            )}; Please refresh the page and try again.`
                          );
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
              {BASIC_INFO.map(({ label, key, formatter }) => (
                <li key={label} className={style.infoItem}>
                  <Input
                    label={label}
                    value={formatter?.(cluster[key]) || cluster[key] || "N/A"}
                    type="showing"
                    onChange={() => {}}
                  />
                </li>
              ))}
            </ul>
          </Fragment>
        </Card>
        <div className={cx("textMedium13", style.selectTable)}>
          {/* <span style={{marginRight: '8px'}}>Table:</span> */}
          <span
            className={cx(
              style.selectTableOption,
              currentTable === "Checkpoints" && style.selected
            )}
            onClick={() => setCurrentTable("Checkpoints")}
          >
            Checkpoints
          </span>{" "}
          |{" "}
          <span
            className={cx(
              style.selectTableOption,
              currentTable === "Billing" && style.selected
            )}
            onClick={() => setCurrentTable("Billing")}
          >
            Billing
          </span>
        </div>
        {currentTable === "Checkpoints" ? (
          <CheckpointList cluster={cluster} />
        ) : (
          <Table
            className={style.billingTable}
            columns={[
              {
                title: "Billing Time",
                dataIndex: "time",
                key: "time",
                width: 150,
                render: (time: number) => {
                  return formatDate(time);
                },
              },
              {
                title: "Average Backup Storage Size",
                dataIndex: "backupStorageSize",
                key: "backupStorageSize",
                width: 200,
              },
              {
                title: "Estimated Payment",
                dataIndex: "price",
                key: "price",
                width: 150,
              },
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
                width: 150,
              },
            ]}
            dataSource={[
              {
                time: Number(new Date("2022-01-31")),
                backupStorageSize: backupPriceInfo.text,
                price: `$${backupPriceInfo.price}`,
                status: "Pending",
              },
              // {
              //   item: "ETL",
              //   count: "1",
              //   unitPrice: "$100",
              //   price: "$100",
              // },
              // {
              //   item: "TOTAL",
              //   price: "$1000",
              // },
            ]}
            rowKey="time"
          />
        )}
      </Fragment>
    </Layout>
  );
}
