import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { IBranchDelete } from 'src/types/branch';
import { ISupply, IMSupply, IMTSupply } from 'src/types/supply';

export function useGetSupplyLists() {
  const URL = endpoints.supply.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      supplies: data?.result.supplies as ISupply[],
      suppliesLoading: isLoading,
      suppliesError: error,
      suppliesValidating: isValidating,
    }),
    [data?.result, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export function useGetSupplyListsByUsers() {
  const URL = endpoints.supply.listByUser;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      supplies: data?.result.supply as ISupply[],
      suppliesLoading: isLoading,
      suppliesError: error,
      suppliesValidating: isValidating,
    }),
    [data?.result, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export function useGetMngSupplyListsByUsers() {
  const URL = endpoints.mng.supply.listByUser;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      supplies: data?.result.products as IMSupply[],
      suppliesLoading: isLoading,
      suppliesError: error,
      suppliesValidating: isValidating,
    }),
    [data?.result, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export const createSupply = async (query: ISupply) => {
  const res = await axiosInstance.post(endpoints.supply.create, {
    supply: query,
  });

  const memoizedValue = {
    data: res?.data || [],
  };

  return memoizedValue;
};

export const createMngSupply = async (query: IMTSupply) => {
  const res = await axiosInstance.post(endpoints.mng.supply.create, {
    supply: query,
  });

  const memoizedValue = {
    data: res?.data || [],
  };

  return memoizedValue;
};

export const SupplyDelete = async (query: IBranchDelete) => {
  const res = await axiosInstance.post(endpoints.supply.delete, {
    supply: query,
  });

  const memoizedValue = {
    data: res?.data || [],
  };

  return memoizedValue;
};

export const MngSupplyDelete = async (query: IBranchDelete) => {
  const res = await axiosInstance.post(endpoints.mng.supply.delete, {
    product: query,
  });

  const memoizedValue = {
    data: res?.data || [],
  };

  return memoizedValue;
};

export const MngSupplyConfirm = async (query: IBranchDelete) => {
  const res = await axiosInstance.post(endpoints.mng.supply.confirm, {
    supply: query,
  });

  const memoizedValue = {
    data: res?.data.result.updatedSupplyOrder as IMSupply,
  };

  return memoizedValue;
};
