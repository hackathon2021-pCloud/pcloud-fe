import { Button } from "antd";
import { Fragment } from "react";
import cx from 'classnames'
import useSWRInfinite from "swr/infinite";
import Link from 'next/link'
import { ClusterInfo } from "../../types";
import Card from "../Card";
import * as style from "./ClusterList.module.css";
import format from 'date-fns/format'

const formatDate = (timestamp: number) => {
  return format(timestamp, "MMMM dd yyyy");
}

export default function ClusterList() {
  const clusters: ClusterInfo[] = [
    {
      id: "abc",
      name: "Cluster 1",
      createTime: Number(new Date("2022-01-01")),
      laskCheckpointTime: Number(new Date("2022-01-02")),
    },
    {
      id: "abc1",
      name: "Cluster 2",
      createTime: Number(new Date("2022-01-01")),
      laskCheckpointTime: Number(new Date("2022-01-02")),
    },
  ];
  return (
    <ul>
      {clusters.map((clt, index) => (
        <li key={index}>
          <Link href={`/cluster?id=${encodeURIComponent(clt.id)}`}>
            <a>
              <Card className={style.clusterCard}>
                <Fragment>
                  <div className={style.cardHeader}>
                    <p className={cx(style.clusterName, "textMedium15")}>
                      {clt.name}
                    </p>
                  </div>
                  <div className={style.infoWrapper}>
                    <span className={style.infoLabel}>Created:</span>
                    <span className={style.infoValue}>
                      {formatDate(clt.createTime)}
                    </span>
                  </div>
                  <div className={style.infoWrapper}>
                    <span className={style.infoLabel}>Last Checkpoint:</span>
                    <span className={style.infoValue}>
                      {formatDate(clt.laskCheckpointTime)}
                    </span>
                  </div>
                  <div className={style.connectionButton}>Connected</div>
                </Fragment>
              </Card>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
}
