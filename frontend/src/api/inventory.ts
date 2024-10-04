import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

import { ITSupply } from 'src/types/supply';
import { ITProduct } from 'src/types/product';

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

export function useGetInventoryOfProduct() {
  const URL = endpoints.inventory.product;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      products: data?.result.inventory as ITProduct[],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
    }),
    [data?.result, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export function useGetInventoryOfSupply() {
  const URL = endpoints.inventory.supply;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      products: data?.result.inventory as ITSupply[],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
    }),
    [data?.result, error, isLoading, isValidating]
  );
  return memoizedValue;
}
