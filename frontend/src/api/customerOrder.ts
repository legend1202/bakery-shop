import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { IMProduct, IMTProduct } from 'src/types/product';

export function useGetCustomOrderListsByUser() {
  const URL = endpoints.mng.customerOrder.listByUser;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      products: data?.result.products as IMProduct[],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
    }),
    [data?.result, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export const createMngCustomerOrder = async (query: IMTProduct) => {
  const res = await axiosInstance.post(endpoints.mng.customerOrder.create, {
    product: query,
  });

  const memoizedValue = {
    data: res?.data || [],
  };

  return memoizedValue;
};
