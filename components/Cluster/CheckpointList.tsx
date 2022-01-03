import { Progress, Table } from "antd";
import { ClusterInfo } from "../../types";
import Loader from "../Loader";
import ActionButton from "./ActionButton";
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
  const checkpoints: ClusterCheckPoint[] = [];
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
    },
    {
      title: "Operator",
      dataIndex: "operator",
      key: "operator",
    },
    {
      title: "Upload Progress",
      key: "uploadStatus",
      dataIndex: "uploadStatus",
      render: (uploadStatus, row) => {
        if (uploadStatus === "ongoing") {
          return <Progress percent={row.uploadProgress} status="active" />;
        }
        return "Finished";
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, row) => (
        <div>
          <ActionButton tokenType="checkpoint" checkPoint={row} />
          <ActionButton tokenType="replication" checkPoint={row} />
        </div>
      ),
    },
  ];
  const data = [
    {
      clusterId: "bkKgeKNG",
      uploadStatus: "ongoing",
      uploadProgress: 50,
      checkpointTime: Number(new Date("2022-01-02")),
      url: "/abc",
      backupSize: 123,
      operator: "root",
    },
    {
      clusterId: "bkKgeKNG",
      uploadStatus: "finished",
      uploadProgress: 100,
      checkpointTime: Number(new Date("2022-01-01")),
      url: "/abc",
      backupSize: 123,
      operator: "root",
    },
  ];

  const isLoading = true;
  return (
    <div className={style.wrapper}>
      {isLoading && (
        <div className={style.loadingOverlay}>
          <Loader />
        </div>
      )}
      <Table className={style.table} columns={columns} dataSource={data} />
    </div>
  );
}
