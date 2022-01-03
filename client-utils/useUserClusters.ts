import useSWR from 'swr'
import { UserClusterResponse } from '../types';
import { fetcher } from './fetcher';

export default function useUserClusterCount(userId: string) {
  const { data, error } = useSWR<UserClusterResponse>(`/api/user-clusters?userid=${encodeURIComponent(userId)}`, fetcher);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}
