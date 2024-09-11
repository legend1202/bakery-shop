import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetInventoryOfBranchByUser() {
  const URL = endpoints.inventory.branch;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      inventory: data?.result.inventory as number,
      attendanceLoading: isLoading,
      attendanceError: error,
      attendanceValidating: isValidating,
    }),
    [data?.result, error, isLoading, isValidating]
  );
  return memoizedValue;
}
