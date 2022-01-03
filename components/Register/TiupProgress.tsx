import { Progress, Button, message } from "antd";
import { Fragment, useEffect, useState } from "react";
import useClusterSetupProgress from "../../client-utils/useClusterSetupProgress";
import { ClusterInfo } from "../../types";
import Loader from "../Loader";
import { useUser } from "@auth0/nextjs-auth0";
import copyTextToClipboard from "../../client-utils/copy";
import * as style from './index.module.css'

export default function TiupProgress({cluster}: {cluster: ClusterInfo}) {
  const {user} = useUser()
  const clusterSetupProgressSwr = useClusterSetupProgress({clusterId: cluster.id, userId: user.sub})
  // const [tiupProgress, setTiupProgress] = useState(-1);
  const isFetchingTiupProgress = false;
  // useEffect(() => {
  //   window.setTiupProgress = setTiupProgress;
  // }, []);
  const progress = clusterSetupProgressSwr.data?.progress || -1
  if (progress === -1) {
    return (
      <section>
        <p className="textMedium13">
          Use below token in TiUP to continue set up
        </p>
        <div className={style.codeWrapper}>
          <p className={style.code}>{cluster?.id}</p>
          <Button
            type="dashed"
            onClick={() => {
              copyTextToClipboard(cluster?.id);

              message.info("Code copied to clipboard");
            }}
          >
            Copy
          </Button>
        </div>
      </section>
    );
  }
  return (
    <section className={style.tiupSetup}>
      <Progress
        type="circle"
        strokeColor={{
          "0%": "#109CF1",
          "100%": "#334d6e",
        }}
        percent={progress}
        className={style.tiupProgress}
        width={200}
        format={(percent) => {
          return (
            <span className={style.tiupProgressNumber}>
              {percent === 100 ? "🎉" : `${percent}%`}
            </span>
          );
        }}
      />
      <div className={style.tiupStatus}>
        {progress === 100 ? (
          <Button href={`/cluster?token=${cluster.id}`} type="dashed">
            Go To Cluster Detail Page
          </Button>
        ) : isFetchingTiupProgress ? (
          <Fragment>
            <span className="textMedium13" style={{ marginRight: 10 }}>
              Updating
            </span>
            <Loader size="small" />
          </Fragment>
        ) : (
          <Fragment>
            <span className="textMedium13">Waiting for setup to finish</span>
          </Fragment>
        )}
      </div>
    </section>
  );
}
