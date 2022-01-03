import useSWR from 'swr'
import { UserClusterResponse } from '../types';
import { fetcher } from './fetcher';

export default function useUserClusters(userId: string) {
  const { data, error } = useSWR<UserClusterResponse>(`/api/user-clusters?userId=${encodeURIComponent(userId)}`, fetcher, {revalidateOnFocus: false});

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}
