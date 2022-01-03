import { Progress, Table } from "antd";
import { useUser } from "@auth0/nextjs-auth0";
import useClusterCheckpoints from "../../client-utils/useClusterCheckpoints";
import { ClusterInfo } from "../../types";
import Loader from "../Loader";
import ActionButton from "./ActionButton";
import formatDate from "../../client-utils/formatDate";
import * as style from './CheckpointList.module.css';

interface ClusterCheckPoint {
  clusterId: string;
  uploadStatus: "ongoing" | "finished";
  uploadProgress: number;
  checkpointTime: number;
  url: string;
  backupSize: number;
  operator: string;
}

export default function CheckpointList({ cluster }: { cluster: ClusterInfo }) {
  const {user} = useUser();
  console.log("CheckpointList");
  console.log({cluster})
  const checkpointListSwr = useClusterCheckpoints({userId: user.sub, clusterId: cluster.id})
  const columns = [
    {
      title: "Cluster ID",
      dataIndex: "clusterId",
      key: "clusterId",
    },
    {
      title: "Checkpoint Time",
      dataIndex: "checkpointTime",
      key: "checkpointTime",
      render: (time) => formatDate(time),
    },
    {
      title: "Operator",
      dataIndex: "operator",
      key: "operator",
      render: (value) => value || "unknown",
    },
    {
      title: "Upload Progress",
      key: "uploadProgress",
      dataIndex: "uploadProgress",
      render: (uploadProgress, row) => {
        if (uploadProgress < 100) {
          return <Progress percent={row.uploadProgress} status="active" />;
        }
        return "Finished";
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, row) => (
        <div className={style.buttonWrapper}>
          <ActionButton
            key="checkpoint"
            tokenType="checkpoint"
            checkPoint={row}
          />
          <ActionButton
            key="replication"
            tokenType="replication"
            checkPoint={row}
          />
        </div>
      ),
    },
  ];

  return (
    <div className={style.wrapper}>
      {checkpointListSwr.isLoading && (
        <div className={style.loadingOverlay}>
          <Loader />
        </div>
      )}
      <Table rowKey={"id"} className={style.table} columns={columns} dataSource={checkpointListSwr.data?.checkpoints || []} />
    </div>
  );
}
