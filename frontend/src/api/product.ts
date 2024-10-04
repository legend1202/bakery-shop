import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';

import { IBranchDelete } from 'src/types/branch';
import { IProduct, IMProduct, IMTProduct } from 'src/types/product';

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

  const { logout } = useAuthContext();

  if (error?.success === false) {
    logout();
  }

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

export function useGetMngCustomerProductListsByUser() {
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

export function useGetMngProductLists() {
  const URL = endpoints.mng.product.list;

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

export const createMngProduct = async (query: IMTProduct) => {
  const res = await axiosInstance.post(endpoints.mng.product.create, {
    product: query,
  });

  const memoizedValue = {
    data: res?.data || [],
  };

  return memoizedValue;
};

export const updateProduct = async (query: IProduct) => {
  const res = await axiosInstance.put(endpoints.product.update, {
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
    data: res?.data.result.updatedProductOrder as IMProduct,
  };

  return memoizedValue;
};

export const MngProductConfirm = async (query: IBranchDelete) => {
  const res = await axiosInstance.post(endpoints.mng.product.confirm, {
    product: query,
  });

  const memoizedValue = {
    data: res?.data.result.updatedProductOrder as IMProduct,
  };

  return memoizedValue;
};
