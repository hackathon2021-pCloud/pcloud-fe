import { Progress, Table } from "antd";
import { useUser } from "@auth0/nextjs-auth0";
import cx from 'classnames';
import useClusterCheckpoints from "../../client-utils/useClusterCheckpoints";
import { ClusterInfo } from "../../types";
import Loader from "../Loader";
import ActionButton from "./ActionButton";
import formatDate, {formatTime} from "../../client-utils/formatDate";
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
  const checkpointListSwr = useClusterCheckpoints({userId: user.sub, clusterId: cluster.id})
  const columns = [
    {
      title: "Checkpoint ID",
      dataIndex: "id",
      key: "id",
      width: 150,
    },
    {
      title: "Checkpoint Time",
      dataIndex: "checkpointTime",
      key: "checkpointTime",
      width: 170,
      render: (time) => (
        <div className={style.dateWrapper}>
          <span className={cx(style.timeString)}>{formatTime(time)}</span>
          <span className={cx(style.dateString)}>{formatDate(time)}</span>
        </div>
      ),
    },
    {
      title: "Operator",
      dataIndex: "operator",
      key: "operator",
      render: (value) => value || "unknown",
      width: 80,
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
      width: 130,
    },
    {
      title: "Action",
      key: "action",
      width: 300,
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
      <Table
        scroll={{ x: 1000 }}
        rowKey={"id"}
        className={style.table}
        columns={columns}
        dataSource={checkpointListSwr.data?.checkpoints || []}
      />
    </div>
  );
}
