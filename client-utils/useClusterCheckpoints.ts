import useSWR from "swr";
import { CheckpointGetRequestQuery, CheckpointGetResponse, UserClusterResponse } from "../types";
import { fetcher } from "./fetcher";

export default function useClusterCheckpoints({ userId, clusterId }: CheckpointGetRequestQuery) {
  const { data, error } = useSWR<CheckpointGetResponse>(
    `/api/checkpoint?userId=${encodeURIComponent(
      userId
    )}&clusterId=${encodeURIComponent(clusterId)}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}
