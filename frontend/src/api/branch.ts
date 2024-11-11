import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { IBranch, IBranchDelete } from 'src/types/branch';

export function useGetBranchLists() {
  const URL = endpoints.branch.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      branches: data?.result.branches as IBranch[],
      brachesLoading: isLoading,
      brachesError: error,
      brachesValidating: isValidating,
    }),
    [data?.result, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export const GetDetailByBranchId = async (branchId: string) => {
  const res = await axiosInstance.get(`${endpoints.branch.getDetail}/${branchId}`);

  return res.data;
};

export const createBranch = async (query: IBranch) => {
  const res = await axiosInstance.post(endpoints.branch.create, {
    branch: query,
  });

  const memoizedValue = {
    data: res?.data || [],
  };

  return memoizedValue;
};

export const udpateBranch = async (query: IBranch) => {
  const res = await axiosInstance.post(endpoints.branch.update, {
    branch: query,
  });

  const memoizedValue = {
    data: res?.data || [],
  };

  return memoizedValue;
};

export const BranchDelete = async (query: IBranchDelete) => {
  const res = await axiosInstance.post(endpoints.branch.delete, {
    branch: query,
  });

  const memoizedValue = {
    data: res?.data || [],
  };

  return memoizedValue;
};
