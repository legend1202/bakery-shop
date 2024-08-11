import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { IBranchDelete } from 'src/types/branch';
import { IAttendance, ITAttendance } from 'src/types/attendance';

export function useGetProductLists() {
  const URL = endpoints.product.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      attendance: data?.result.products as IAttendance[],
      attendanceLoading: isLoading,
      attendanceError: error,
      attendanceValidating: isValidating,
    }),
    [data?.result, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export function useGetAttendanceByUser() {
  const URL = endpoints.attendance.listByUser;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      products: data?.result.products as IAttendance[],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
    }),
    [data?.result, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export function useGetAttendance() {
  const URL = endpoints.attendance.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      attendances: data?.result.results as ITAttendance[],
      attendancesLoading: isLoading,
      attendancesError: error,
      attendancesValidating: isValidating,
    }),
    [data?.result, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export const createAttendance = async (query: IAttendance) => {
  const res = await axiosInstance.post(endpoints.attendance.create, {
    product: query,
  });

  const memoizedValue = {
    data: res?.data || [],
  };

  return memoizedValue;
};

export const AttendanceDelete = async (query: IBranchDelete) => {
  const res = await axiosInstance.post(endpoints.attendance.delete, {
    product: query,
  });

  const memoizedValue = {
    data: res?.data || [],
  };

  return memoizedValue;
};
