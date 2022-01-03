import { Fragment } from "react";
import { ClusterInfo, ClusterSetupStatus, StorageProvider } from "../../types";
import Layout from "../Layout";
import Card from "../Card";
import Input from "../Input";
import * as style from './index.module.css';
import CheckpointList from "./CheckpointList";

const BASIC_INFO = [
  { label: "Create Time", key: "createTime" },
  { label: "Last Cehckpoint", key: "laskCheckpointTime" },
  { label: "ID", key: "id" },
  { label: "Setup Status", key: "setupStatus" },
  { label: "Storage Provider", key: "storageProvider" },
  { label: "Owner", key: "owner" },
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
  const cluster: ClusterInfo = {
    name: "Cluster 1",
    createTime: Number(new Date("2022-01-02")),
    laskCheckpointTime: Number(new Date("2022-01-02")),
    id: "JKFENQWIG",
    setupStatus: ClusterSetupStatus.finish,
    storageProvider: StorageProvider.aws,
    owner: "github|2342341"
  };
  return (
    <Layout>
      <Fragment>
        <h1 className="textMedium15">Cluster: {cluster.name}</h1>
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
        <CheckpointList />
      </Fragment>
    </Layout>
  );
}
