import { Button, message, Modal } from "antd";
import { useState } from "react";
import cx from 'classnames';
import { useUser } from "@auth0/nextjs-auth0";
import copyToClipboard from "../../client-utils/copy";
import { ClusterCheckPoint, TemporaryTokenPostRequestBody, TemporaryTokenPostResponse } from "../../types";
import * as style from './ActionButton.module.css'

export default function ActionButton({
  tokenType,
  checkPoint
}: {
  tokenType: "checkpoint" | "replication";
  checkPoint: ClusterCheckPoint
}) {
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useUser()
  return (
    <Button
      loading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        const res = await fetch('/api/temporary-token', {method: 'POST', body: JSON.stringify({
          type: tokenType,
          checkpointId: checkPoint.id,
          userId: user.sub
        } as TemporaryTokenPostRequestBody)})
        const json = await res.json() as TemporaryTokenPostResponse
        if (res.status !== 200) {
          return message.error(`Failed to create token: ${json}`);
        }
        const token = json.token;
        setIsLoading(false);
        Modal.info({
          title: <span className={style.modalTitle}>Checkpoint Token</span>,
          content: (
            <div className={style.modalContent}>
              <p className={cx(style.token, "textMedium15")}>{token}</p>
            </div>
          ),
          onOk: () => {
            copyToClipboard(token);
            message.info('Token copied to clipboard');
          },
          okText: 'Copy',
        });
      }}
      className={style.button}
    >
      {tokenType === 'checkpoint' ? 'Checkpoint Token' : 'Replication Token'}
    </Button>
  );
}
