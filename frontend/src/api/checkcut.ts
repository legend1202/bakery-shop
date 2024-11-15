
import axiosInstance, { endpoints } from 'src/utils/axios';

import { ICashcut } from 'src/types/cashcut';

export const GetCashcut = async (saleDate: string) => {
  const res = await axiosInstance.get(`${endpoints.checkcut.getCheckcut}/${saleDate}`);
  return res.data;
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
