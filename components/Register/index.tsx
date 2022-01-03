import Layout from "../Layout";
import Card from "../Card";
import { Fragment, useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";

import AWS from "./Amazon_Web_Services-Logo.wine.svg";
import kingsoft from "./kingsoft.png";
import { useRouter } from "next/router";
import { Steps, Button, message, Progress, Modal } from "antd";
const { Step } = Steps;

import * as style from "./index.module.css";
import Loader from "../Loader";
import Input from "../Input";
import useUserCluster from "../../client-utils/useUserClusters";
import {
  ClusterInfo,
  ClusterPostRequestBody,
  ClusterPostResponse,
  StorageProvider as StorageProviderEnum,
} from "../../types";
import TiupProgress from "./TiupProgress";

const StorageProviders = [
  {
    name: "AWS",
    image: AWS,
  },
  {
    name: "Kingsoft",
    image: kingsoft,
  },
];

const STEPS = [
  { title: "Confirm Cluster Name" },
  { title: "Choose Cloud Storage Provider" },
  { title: "Setup in TiUP" },
];

const isNextButtonDisabled = ({
  currentStep,
  clusterName,
  selectedSp,
}: {
  currentStep: number;
  clusterName: string;
  selectedSp;
}) => {
  if (currentStep === 0) {
    return clusterName === "";
  }
  if (currentStep === 1) {
    return selectedSp === "";
  }
  return false;
};

export default function Register() {
  const router = useRouter();
  const [clusterName, setClusterName] = useState<string>("");
  const [selectedSp, setSelectedSp] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(0);
  const [createdCluster, setCreatedCluster] = useState<ClusterInfo | undefined>(undefined
    // {
    //   authKey: "authKeyExample",
    //   createTime: 1641184362792,
    //   id: "QInAyhlRCOLPFfh4",
    //   name: "Cluster 2",
    //   owner: "github|16663610",
    //   storageProvider: StorageProviderEnum.aws,
    // }
  );
  const { user } = useUser();
  const userClusterSwr = useUserCluster(user.sub);
  const [isNextButtonLoading, setIsNextButtonLoading] = useState(false);

  useEffect(() => {
    window.setCurrentStep = setCurrentStep;
  }, []);
  useEffect(() => {
    const { data, isError, isLoading } = userClusterSwr;
    if (data && clusterName === "") {
      setClusterName(`Cluster ${data.clusterInfos.length + 1}`);
    }
  }, [userClusterSwr.data]);

  const { query } = router;
  const registerToken = query["register_token"];

  if (!registerToken) {
    return (
      <Layout>
        <p>Invalid RegisterToken</p>
      </Layout>
    );
  }
  console.log({
    query,
    user,
    userClusterCountSwr: userClusterSwr,
    createdCluster,
  });

  return (
    <Layout title="Register">
      <Fragment>
        <Steps current={currentStep} size="small">
          {STEPS.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        {currentStep === 0 && (
          <Card>
            <Input
              label="Cluster name"
              value={clusterName}
              onChange={(e) => setClusterName(e.target.value.slice(0, 50))}
              className={style.clusterName}
            />
          </Card>
        )}
        {currentStep === 1 && (
          <Card>
            <ul className={style.list}>
              {StorageProviders.map((sp) => {
                const isSelected = selectedSp === sp.name;
                return (
                  <li
                    key={sp.name}
                    className={style.listItem}
                    onClick={() => setSelectedSp(sp.name)}
                  >
                    <img src={sp.image.src} className={style.spLogo} />
                    <Button type={isSelected ? "primary" : "default"}>
                      {isSelected ? `Selected ${sp.name}` : "Select"}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}
        {currentStep === 2 && (
          <Card>
            <TiupProgress cluster={createdCluster} />
          </Card>
        )}
        {currentStep !== 0 && currentStep !== STEPS.length - 1 && (
          <Button
            style={{ marginRight: "10px" }}
            onClick={() => {
              setCurrentStep((v) => v - 1);
            }}
          >
            Back
          </Button>
        )}
        {currentStep < STEPS.length - 1 && (
          <Button
            type="primary"
            disabled={isNextButtonDisabled({
              currentStep,
              clusterName,
              selectedSp,
            })}
            loading={isNextButtonLoading}
            onClick={async () => {
              if (currentStep === 0) {
                if (
                  userClusterSwr.data?.clusterInfos.find(
                    (c) => c.name === clusterName
                  )
                ) {
                  Modal.error({
                    content: `There already exist a cluster named ${clusterName}`,
                  });
                  return;
                }
              }
              if (currentStep === 1) {
                setIsNextButtonLoading(true);
                const res = await fetch("/api/cluster", {
                  method: "POST",
                  body: JSON.stringify({
                    owner: user.sub,
                    storageProvider: selectedSp,
                    name: clusterName,
                    registerToken,
                  } as ClusterPostRequestBody),
                });
                setIsNextButtonLoading(false);
                const json = await res.json();
                if (res.status !== 200) {
                  return Modal.error({
                    content: `Failed to create cluster: ${JSON.stringify(
                      json
                    )}`,
                  });
                }
                setCreatedCluster((json as ClusterPostResponse).cluster);
              }
              setCurrentStep((v) => v + 1);
            }}
          >
            Next
          </Button>
        )}
      </Fragment>
    </Layout>
  );
}
