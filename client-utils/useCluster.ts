import useSWR from "swr";
import { ClusterGetRequestQuery, ClusterGetResponse, UserClusterResponse } from "../types";
import { fetcher } from "./fetcher";

export default function useCluster(query: ClusterGetRequestQuery) {
  const { data, error } = useSWR<ClusterGetResponse>(
    `/api/cluster?userId=${encodeURIComponent(query.userId)}&clusterId=${encodeURIComponent(query.clusterId)}`,
    fetcher
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}
