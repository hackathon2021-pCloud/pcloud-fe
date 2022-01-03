import { useRef } from "react";
import useSWR from "swr";
import { ClusterGetRequestQuery, ClusterSetupProgressGetRequestQuery, ClusterSetupProgressGetResponse, UserClusterResponse } from "../types";
import { REFRESH_INTERVAL } from "./constants";
import { fetcher } from "./fetcher";

export default function useClusterSetupProgress({ clusterId, userId }: ClusterSetupProgressGetRequestQuery) {
  const { data, error } = useSWR<ClusterSetupProgressGetResponse>(
    `/api/cluster-setup-progress?clusterId=${encodeURIComponent(
      clusterId
    )}&userId=${encodeURIComponent(userId)}`,
    fetcher,
    { refreshInterval: (lastData) => lastData?.progress === 100 ? Infinity : REFRESH_INTERVAL}
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}
