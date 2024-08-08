import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { ISale } from 'src/types/sale';
import { IBranchDelete } from 'src/types/branch';

export function useGetSaleListsByUser() {
  const URL = endpoints.sale.listByUser;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      sales: data?.result.sales as ISale[],
      salesLoading: isLoading,
      salesError: error,
      salesValidating: isValidating,
    }),
    [data?.result, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export const createSale = async (query: ISale) => {
  const res = await axiosInstance.post(endpoints.sale.create, {
    sales: query,
  });

  const memoizedValue = {
    data: res?.data || [],
  };

  return memoizedValue;
};

export const SaleDelete = async (query: IBranchDelete) => {
  const res = await axiosInstance.post(endpoints.sale.delete, {
    product: query,
  });

  const memoizedValue = {
    data: res?.data || [],
  };

  return memoizedValue;
};
