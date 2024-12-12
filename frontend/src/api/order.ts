import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { IOrder } from 'src/types/order';

export function useGetOrderLists() {
  const URL = endpoints.order.getOrder;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      orders: data?.result.orders as IOrder[],
      ordersLoading: isLoading,
      ordersError: error,
      ordersValidating: isValidating,
    }),
    [data?.result, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export const createOrder = async (orderData: IOrder) => {
  const res = await axiosInstance.post(endpoints.order.create, {
    orderData,
  });

  const memoizedValue = {
    data: res?.data || [],
  };

  return memoizedValue;
};

export const OrderDelete = async (query: string) => {
  const res = await axiosInstance.post(endpoints.order.delete, {
    orderId: query,
  });

  const memoizedValue = {
    data: res?.data.result.order as IOrder,
  };

  return memoizedValue;
};

export const OrderConfirm = async (query: string) => {
  const res = await axiosInstance.post(endpoints.order.confirm, {
    orderId: query,
  });

  const memoizedValue = {
    data: res?.data.result.order as IOrder,
  };

  return memoizedValue;
};
