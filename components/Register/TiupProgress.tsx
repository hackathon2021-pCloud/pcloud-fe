import { Progress, Button, message } from "antd";
import { Fragment, useEffect, useState } from "react";
import { ClusterInfo } from "../../types";
import Loader from "../Loader";
import * as style from './index.module.css'

function fallbackCopyTextToClipboard(text: string) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text: string) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}

export default function TiupProgress({cluster}: {cluster: ClusterInfo}) {
  const [tiupProgress, setTiupProgress] = useState(-1);
  const isFetchingTiupProgress = false;
  useEffect(() => {
    window.setTiupProgress = setTiupProgress;
  }, []);
  if (tiupProgress === -1) {
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
        percent={tiupProgress}
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
        {tiupProgress === 100 ? (
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
