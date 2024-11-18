import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { ICashcut, ICashcutList } from 'src/types/cashcut';

export const GetCashcut = async (saleDate: string) => {
  const res = await axiosInstance.get(`${endpoints.checkcut.getCheckcut}/${saleDate}`);
  return res.data;
};

export const useGetTotalCashcut = () => {
  const URL = endpoints.checkcut.getTotalCheckcut;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      cashcuts: (data?.result.cashcut as ICashcutList[]) || [],
      cashcutsLoading: isLoading,
      cashcutsError: error,
      cashcutsValidating: isValidating,
    }),
    [data?.result, error, isLoading, isValidating]
  );
  return memoizedValue;
};

export const createCashcut = async (cashcut: ICashcut) => {
  const res = await axiosInstance.post(endpoints.checkcut.create, {
    cashcut,
  });

  const memoizedValue = {
    data: res?.data || [],
  };

  return memoizedValue;
};
