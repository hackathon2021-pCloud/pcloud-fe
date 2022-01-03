import { Button, message, Modal } from "antd";
import { useState } from "react";
import copyToClipboard from "../../client-utils/copy";
import { ClusterCheckPoint } from "../../types";

export default function ActionButton({
  tokenType,
  checkPoint
}: {
  tokenType: "checkpoint" | "replication";
  checkPoint: ClusterCheckPoint
}) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      loading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        //     const token = fetch('')
        const token = "ABC";
        setIsLoading(false);
        Modal.info({
          title: <span>Checkpoint Token</span>,
          content: (
            <div>
              <p>{token}</p>,
              <Button
                onClick={() => {
                  copyToClipboard(token);
                  message.info("Copied to clipboard");
                }}
                type="dashed"
              >
                Copy
              </Button>
            </div>
          ),
        });
      }}
    >
      {tokenType === 'checkpoint' ? 'Checkpoint Token' : 'Replication Token'}
    </Button>
  );
}
