import { Fragment } from "react";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";
import { ClusterInfo, ClusterSetupStatus, StorageProvider } from "../../types";
import Layout from "../Layout";
import Card from "../Card";
import Input from "../Input";
import * as style from './index.module.css';
import CheckpointList from "./CheckpointList";
import useCluster from "../../client-utils/useCluster";
import Loader from "../Loader";

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
  const {user} = useUser()
  const router = useRouter();
  const { id } = router.query;
  const clusterSwr = useCluster({userId: user.sub, clusterId: id as string})

  if (!clusterSwr.data?.cluster) {
    return (
      <div className={style.loadingOverlay}>
        <Loader />
      </div>
    );
  }

  const cluster = clusterSwr.data.cluster

  console.log(clusterSwr)

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
        <CheckpointList cluster={cluster} />
      </Fragment>
    </Layout>
  );
}
