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
          No cluster id,  {" "}
          <Link href={"/"}>
            <a>back to Dashbaord</a>
          </Link>
        </Fragment>
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
