import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { IBranchDelete } from 'src/types/branch';
import { IProduct, IMProduct } from 'src/types/product';

export function useGetProductLists() {
  const URL = endpoints.product.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      products: data?.result.products as IProduct[],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
    }),
    [data?.result, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export function useGetProductListsByUser() {
  const URL = endpoints.product.listByUser;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      products: data?.result.products as IProduct[],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
    }),
    [data?.result, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export function useGetMngProductListsByUser() {
  const URL = endpoints.mng.product.listByUser;

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

export const createProduct = async (query: IProduct) => {
  const res = await axiosInstance.post(endpoints.product.create, {
    product: query,
  });

  const memoizedValue = {
    data: res?.data || [],
  };

  return memoizedValue;
};

export const createMngProduct = async (query: IMProduct) => {
  const res = await axiosInstance.post(endpoints.mng.product.create, {
    product: query,
  });

  const memoizedValue = {
    data: res?.data || [],
  };

  return memoizedValue;
};

export const ProductDelete = async (query: IBranchDelete) => {
  const res = await axiosInstance.post(endpoints.product.delete, {
    product: query,
  });

  const memoizedValue = {
    data: res?.data || [],
  };

  return memoizedValue;
};

export const MngProductDelete = async (query: IBranchDelete) => {
  const res = await axiosInstance.post(endpoints.mng.product.delete, {
    product: query,
  });

  const memoizedValue = {
    data: res?.data || [],
  };

  return memoizedValue;
};
