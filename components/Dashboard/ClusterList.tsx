import { Button } from "antd";
import { Fragment } from "react";
import cx from "classnames";
import useSWRInfinite from "swr/infinite";
import Link from "next/link";
import { ClusterInfo } from "../../types";
import Card from "../Card";
import * as style from "./ClusterList.module.css";
import formatDate from "../../client-utils/formatDate";
import useUserClusters from "../../client-utils/useUserClusters";
import { useUser } from "@auth0/nextjs-auth0";
import Loader from "../Loader";

export default function ClusterList() {
  const { user } = useUser();
  const userClusterSwr = useUserClusters(user.sub);

  if (!userClusterSwr.data?.clusterInfos?.length) {
    return (
      <Card className={cx(userClusterSwr.isLoading && style.loadingWrapper, "textMedium15")}>
        {userClusterSwr.isLoading ? <Loader size="small" /> : "No Cluster Registered"}
      </Card>
    );
  }

  return (
    <ul>
      {userClusterSwr.data?.clusterInfos.map((clt, index) => (
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
